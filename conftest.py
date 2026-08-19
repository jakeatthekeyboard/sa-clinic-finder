"""Test-session git guard — ported from product-pipeline-1 #1229.

WHY THIS FILE EXISTS IN A SITE REPO
This repo's `.githooks/pre-push` runs `python3 -m pytest`. A pre-push hook is a
CHILD OF GIT, and git exports its own repository environment into hook children —
which is the exact condition that let a test fixture in the pipeline repo mutate a
live checkout on 2026-08-19.

The mechanism: `git -C <dir>` sets only the working directory. It does NOT override
`GIT_DIR`. GIT_DIR beats -C, beats cwd, and beats every path a test passes. A pytest
process holding GIT_DIR therefore retargets every `git -C tmp_path ...` call at the
real repository, silently, with every command exiting 0 and no `.git` ever appearing
under tmp_path. In the pipeline repo that wrote `core.bare = true` into the shared
config and landed a fixture commit on the live branch; `git status` then failed for
every session.

No test in this repo shells out to git today. This is deliberate prevention, not a
repair: the exposure is the hook context, which is permanent, and the cost of the
guard is one autouse fixture. Full write-up:
product-pipeline-1/tools/testing/git_sandbox.py

TWO DEFENCES
1. Strip the GIT_* overrides for the whole session (removes the cause).
2. Refuse any git WRITE that does not resolve under a temp root (removes the whole
   failure mode, including for tests not yet written).

Reads are deliberately untouched — a test may legitimately inspect a real repo.
"""
import os
import subprocess
import tempfile
from pathlib import Path

import pytest

GIT_ENV_OVERRIDES = (
    "GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_COMMON_DIR",
    "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    "GIT_NAMESPACE", "GIT_PREFIX", "GIT_CEILING_DIRECTORIES",
)

GIT_WRITE_SUBCOMMANDS = frozenset({
    "init", "clone", "add", "commit", "config", "rm", "mv", "checkout", "switch",
    "restore", "reset", "revert", "merge", "rebase", "cherry-pick", "am", "apply",
    "branch", "tag", "push", "fetch", "pull", "remote", "worktree", "stash", "gc",
    "prune", "update-ref", "symbolic-ref", "update-index", "write-tree",
    "commit-tree", "hash-object", "repack", "filter-branch", "submodule", "clean",
    "notes", "replace", "reflog", "maintenance",
})

# `git config --get` is how tests ASSERT. Treating it as a write fires the guard on
# ordinary assertions, and a guard that noisy gets switched off.
_CONFIG_READ_FLAGS = frozenset({"--get", "--get-all", "--get-regexp", "--get-urlmatch",
                                "--list", "-l", "--show-origin", "--show-scope"})
_GLOBAL_OPTS_WITH_VALUE = frozenset({"-C", "-c", "--git-dir", "--work-tree",
                                     "--namespace", "--exec-path", "--super-prefix"})


class SandboxEscape(AssertionError):
    """A test was about to run a git write against something outside a temp root."""


def _parse(argv):
    if not argv or Path(str(argv[0])).name not in ("git", "git.exe"):
        return None, None
    dash_c, i = None, 1
    while i < len(argv):
        tok = str(argv[i])
        if tok == "-C" and i + 1 < len(argv):
            dash_c, i = str(argv[i + 1]), i + 2
            continue
        if tok in _GLOBAL_OPTS_WITH_VALUE:
            i += 2
            continue
        if tok.startswith("-"):
            i += 1
            continue
        return tok, dash_c
    return None, dash_c


def _is_write(sub, argv):
    if sub not in GIT_WRITE_SUBCOMMANDS:
        return False
    if sub == "config" and any(str(t) in _CONFIG_READ_FLAGS for t in argv):
        return False
    return True


def _under(path, roots):
    p = Path(path).expanduser().resolve()
    for root in roots:
        r = Path(root).expanduser().resolve()
        if p == r or r in p.parents:
            return True
    return False


@pytest.fixture(scope="session", autouse=True)
def _git_session_guard(tmp_path_factory):
    removed = {v: os.environ.pop(v) for v in GIT_ENV_OVERRIDES if v in os.environ}

    # /tmp is listed explicitly: macOS sets TMPDIR to /var/folders/..., so
    # gettempdir() does not cover /tmp paths used as throwaway fixtures.
    roots = [tmp_path_factory.getbasetemp(), Path(tempfile.gettempdir()),
             Path("/tmp"), Path("/private/tmp")]

    original = subprocess.Popen.__init__

    def guarded(self, args, *a, **kw):
        argv = args if isinstance(args, (list, tuple)) else None
        if argv:
            sub, dash_c = _parse(argv)
            if _is_write(sub, argv):
                leaked = {v: os.environ[v] for v in GIT_ENV_OVERRIDES if v in os.environ}
                if leaked:
                    raise SandboxEscape(
                        f"[SANDBOX ESCAPE] refusing `git {sub}`: git environment "
                        f"overrides are set and they beat both -C and cwd -> {leaked}."
                    )
                cwd = kw.get("cwd") or os.getcwd()
                # -C wins over the cwd kwarg, which wins over the process cwd.
                if dash_c is not None:
                    effective = Path(dash_c) if os.path.isabs(dash_c) else Path(cwd) / dash_c
                else:
                    effective = Path(cwd)
                targets = [effective]
                if sub in ("init", "clone"):
                    # `git init <abs path>` names its target positionally and ignores cwd.
                    explicit = [Path(t) for t in map(str, argv[1:])
                                if os.path.isabs(t) and not t.startswith("-")]
                    if explicit:
                        targets = explicit
                outside = [str(t) for t in targets if not _under(t, roots)]
                if outside:
                    raise SandboxEscape(
                        f"[SANDBOX ESCAPE] refusing `git {sub}` targeting {outside}: not "
                        f"under a temp root. Tests must never write to a real repository. "
                        "Build a synthetic repo under tmp_path instead."
                    )
        return original(self, args, *a, **kw)

    subprocess.Popen.__init__ = guarded
    try:
        yield roots
    finally:
        subprocess.Popen.__init__ = original
        os.environ.update(removed)
