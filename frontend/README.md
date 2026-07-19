# R&R Food Products — Storefront (source)

This is the source code for the public website. It's built (`npm run build`)
into `dist/`, which the backend in `../backend` then serves directly — the
whole site is deployed as part of that one server, at your domain
(e.g. `rnrfood.com`). See `../README.md` for the full picture and deployment
instructions.

The site pulls its product/category/varieties/team/testimonials/settings data
live from the CMS backend on page load (relative `/api/catalog` calls — same
domain, no configuration needed), falling back to the bundled static catalogue
in `src/data/fallbackData.js` if the backend is ever unreachable.

Per-page SEO (title, description, social preview) is handled by
`src/components/Seo.jsx`, used at the top of every page.
