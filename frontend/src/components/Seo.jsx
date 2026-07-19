import { Helmet } from "react-helmet-async";

// The canonical production domain. Used to build absolute canonical
// and Open Graph URLs regardless of what domain a preview/staging
// deploy happens to be running on.
export const SITE_URL = "https://rnrfood.com";
export const SITE_NAME = "R&R Food Products";

// The three name variants the client wants findable — woven into the
// default description/keywords so they show up on every page, with
// each page's own title/description layered on top for that page's
// specific topic.
const BRAND_NAMES = "R&R Food Products | Riya and Rakshya Food Products | RNR Food Products";

// The three exact search phrases the client wants to rank for, woven into
// the keywords tag on every page so crawlers index all of them.
const KEYWORDS = [
  "rnr food products",
  "RNR Food Products",
  "R&R food products",
  "R&R Food Products",
  "Riya and Rakshya Food Products",
  "Riya and Rakshya Food products",
  "riya and rakshya food products",
  "Nepali snacks",
  "namkeen Nepal",
  "Bhairahawa snacks manufacturer",
].join(", ");

/**
 * Drop this at the top of any page to set that page's <title>,
 * meta description, canonical link, and social-sharing tags.
 *
 * @param {string} title - Page-specific title (brand name is appended automatically)
 * @param {string} description - 1-2 sentence page-specific description
 * @param {string} path - route path starting with "/", e.g. "/products"
 * @param {string} [image] - absolute or root-relative image URL for social sharing
 * @param {boolean} [noindex] - set true for pages like Cart/Wishlist that shouldn't be indexed
 */
export default function Seo({ title, description, path = "/", image, noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — ${BRAND_NAMES}`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : `${SITE_URL}/images/hero.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`${KEYWORDS}${description ? `, ${title || ""}` : ""}`} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
