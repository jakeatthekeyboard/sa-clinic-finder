import { localePath, type Locale } from './config';
import { hasTranslation } from './translated';

/**
 * The href to use for `basePath` from inside `locale`: the translated page when one
 * exists, the English page when it does not.
 *
 * Needed because the locale families land in stages, and a page in one family links
 * into another — a province page lists its facilities, a service page lists them by
 * province, a facility page links its neighbours. Prefixing those unconditionally means
 * that between the province stage and the facility stage every one of those links is a
 * 404, on a health site, for the reader least able to recover from it. Prefixing
 * NOTHING is the mirror failure: it strands a reader in English the moment the
 * translation does exist.
 *
 * So the decision is delegated to `hasTranslation` — the SAME predicate the language
 * switcher and the hreflang cluster read — which means the link, the switcher and the
 * alternates can never disagree, and every one of them flips together the moment
 * COVERAGE gains a family. Nothing here needs revisiting when a stage ships.
 *
 * `localePath` is still the only thing that builds a prefixed URL; this only chooses
 * whether to call it.
 */
export function localeHref(basePath: string, locale: Locale): string {
  return hasTranslation(basePath, locale) ? localePath(basePath, locale) : basePath;
}

/** `localeHref` bound to one locale — `const LX = localeHrefFor('xh')`. */
export function localeHrefFor(locale: Locale): (basePath: string) => string {
  return (basePath: string) => localeHref(basePath, locale);
}

/**
 * Rewrite the internal links inside an editorial HTML string into `locale`.
 *
 * The editorial data files (province, service, facility-type and facility editorial,
 * in every locale) carry inline markup like `<a href="/services/tb">…</a>`. Those
 * hrefs are stored as CANONICAL ENGLISH paths — deliberately, and in every locale's
 * copy of the prose:
 *
 *  - a translator editing prose must never also have to remember a URL convention,
 *    and a hand-prefixed `/xh/...` in a data file is invisible until someone reads a
 *    404 in a language they do not speak;
 *  - the English path is the join key the whole i18n layer already runs on
 *    (`stripLocale`, hreflang pairing, the switcher, COVERAGE), so keeping the data
 *    on that key means one representation, not two.
 *
 * So the prefix is applied HERE, once, at render time, through `localePath` — the
 * same function every other link on the site goes through. `localePath` is a pure
 * prefix operation, so an already-prefixed path is idempotent under it and a
 * non-internal href (tel:, mailto:, https://, #anchor) never matches the pattern.
 *
 * Each href resolves through `localeHref` rather than `localePath` directly, so a prose
 * cross-link into a family this locale has not translated YET lands on the English page
 * instead of a 404. That matters here specifically: the editorial links into /services,
 * /guides, /clinics and one facility page, and those families ship in separate stages.
 *
 * Only `href="…"` with a leading slash is touched: relative and protocol-qualified
 * URLs are left exactly as authored.
 */
export function localiseHtml(html: string, locale: Locale): string {
  if (locale === 'en') return html;
  return html.replace(/href="(\/[^"]*)"/g, (_m, path: string) => `href="${localeHref(path, locale)}"`);
}

/** `localiseHtml` bound to one locale — handy as `const LH = localiseHtmlFor('xh')`. */
export function localiseHtmlFor(locale: Locale): (html: string) => string {
  return (html: string) => localiseHtml(html, locale);
}
