# R&R Food Products — Website + Content Manager

This package has three parts, but they're deployed as **one single app on one
domain**: `rnrfood.com`.

```
rr-food-cms/
├── backend/    ← One Node.js server. Serves everything below.
│   ├── (API)         → rnrfood.com/api/...
│   ├── (Admin panel) → rnrfood.com/admin
│   └── (Website)     → rnrfood.com/   (the built frontend, served as static files)
├── admin/      ← The Content Manager screens (served by the backend, at /admin)
└── frontend/   ← Source code for the public website (built into frontend/dist)
```

## How it fits together

```
                         rnrfood.com
                              │
                    ┌─────────┴─────────┐
                    │   backend server   │   (the only thing you deploy/run)
                    └─────────┬─────────┘
        ┌───────────────┬─────┴─────┬──────────────┐
        ▼                ▼          ▼               ▼
   rnrfood.com/     rnrfood.com  rnrfood.com/   rnrfood.com/
      admin           (website)    api/...       sitemap.xml
   (Content         (built React  (product/       (auto-generated
    Manager)         app)          category/etc     from your live
                                    data)            product list)
```

Because it's all one server on one domain, there's no separate hosting, no
CORS setup, and no extra DNS record needed for the admin panel — whatever
domain you point at the backend, `/admin` and `/api` come along automatically.

**If the backend is ever unreachable, the website automatically falls back to
the last-known product catalogue that's built into the site itself** —
visitors will never see a broken or empty page.

## Quick start (local testing on your own computer)

You'll need [Node.js](https://nodejs.org) installed (version 20.19+ or 22.12+) and a running MySQL server. Create a database (for example `rr_food_cms`), then copy `backend/.env.example` to `backend/.env` and enter your MySQL host, database, username, and password. The backend creates its `app_state` table automatically and imports `backend/data/db.json` once if it exists and the MySQL table is empty.

```bash
npm run setup       # installs both backend and frontend dependencies
npm run seed         # loads initial products and admin into MySQL (first run)
npm run seed-pages   # loads default page content into the CMS, one time only
npm run build        # builds the website
npm start            # starts the one server — website + admin + API together
```
Open **http://localhost:4000** for the website and **http://localhost:4000/admin**
for the Content Manager.

(For active frontend development with hot-reload, run `npm run dev:backend` and
`npm run dev:frontend` in two terminals instead — the frontend dev server proxies
API calls to the backend automatically, see `frontend/vite.config.js`.)

## Everyday use — the Content Manager

Log in at `/admin` (see username/password printed by `npm run seed`, or set your
own in `backend/.env` first). Seven sections in the sidebar:

- **Products** — the main screen. Add, edit, delete products: name, category, photo,
  description, sizes & prices, ingredients, allergy info, and an optional badge like
  "Bestseller". Search and filter by category to find things quickly.
- **Categories** — the groups shown as filter buttons on your Products page. Some
  groups have sub-categories (like a dropdown). Renaming a category here doesn't
  rename it on existing products — update those separately if you rename something.
- **Varieties** — reusable content for flavor/variety showcases.
- **Team** — the team member cards on your About page.
- **Testimonials** — the customer quotes shown on your Home page.
- **Pages** — edit the text content, headings, images, and CTAs for every page on
  the website: Home, About, Contact, Manufacturing, Products, and the shared
  Navbar & Footer. Changes appear live once saved.
- **Site Settings** — your contact email, phone numbers, WhatsApp number, and address,
  used across the site's footer, Contact page, and order buttons. This is also where
  you change your admin password.

Every screen has a **Save** button — nothing goes live until you click it. Deleting
a product asks you to confirm first. Photo uploads happen right inside the product
form. Every save writes the current CMS state to MySQL.

## Deploying this for real (going live on rnrfood.com)

You only need to deploy **one thing: the backend**. It serves the website, the
admin panel, and the API all together.

1. **Pick a host with persistent disk** — Render, Railway, or any basic VPS
   (e.g. DigitalOcean). It's a plain Node.js app (`npm start`), most hosts detect
   this automatically.
   - ⚠️ **Don't use Vercel for this** — Vercel's serverless functions don't keep
     files on disk between requests, so your product database and uploaded
     photos would disappear. A host with a persistent filesystem is required.

2. **Point rnrfood.com at it.** Add a DNS record (usually a CNAME or A record,
   depending on your host's instructions) so `rnrfood.com` resolves to your
   deployed backend. Once that's done:
   - `rnrfood.com` → the website
   - `rnrfood.com/admin` → the Content Manager
   - `rnrfood.com/api` → the API
   all work automatically, with no further configuration.

3. **Create a MySQL database** on your host and set `MYSQL_HOST`, `MYSQL_PORT`,
   `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` before running the seed
   commands. Also configure the app environment variables (see `backend/.env.example`):
   `JWT_SECRET` (generate a long random string), `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.
   If `JWT_SECRET` is left blank, a random one is generated on startup (admin
   sessions won't survive restarts). `ALLOWED_ORIGIN` can stay as `*` since
   everything is same-domain now.

4. **Build steps on the host**, in order:
   ```bash
   npm run setup      # install dependencies
   npm run seed       # first deploy only — loads the starting catalogue
   npm run seed-pages # first deploy only — loads default page content
   npm run build      # builds the website into frontend/dist
   npm start           # starts the server
   ```
   Most hosts let you set the "build command" to
   `npm run setup && npm run seed && npm run seed-pages && npm run build`
   and the "start command" to `npm start`.

5. Log in at `rnrfood.com/admin` and change the default password right away
   (Site Settings → Change Your Password).

### If you ever DO split hosting (website and backend on different domains)

The site still works — set `VITE_API_URL` in `frontend/.env` to your backend's
URL before building, and set `ALLOWED_ORIGIN` on the backend to your website's
domain. This isn't the recommended setup for this project, but it's supported.

## SEO

The site is set up to rank for all three ways people search for this business:
**"RNR Food Products"**, **"R&R Food Products"**, and **"Riya and Rakshya Food
Products"**. Specifically:

- Every page has its own `<title>` and meta description (see
  `frontend/src/components/Seo.jsx`), all mentioning the brand name variants.
- `index.html` carries default title/description/keywords plus Open Graph and
  Twitter Card tags for link previews when the site is shared on social media
  or messaging apps.
- A `ld+json` **Organization** structured-data block in `index.html` explicitly
  lists all three name variants as `alternateName`s, so search engines connect
  them to the same business.
- `rnrfood.com/sitemap.xml` is generated live by the backend from your actual
  product list — add or remove a product in the CMS and it's reflected in the
  sitemap immediately, no manual step.
- `rnrfood.com/robots.txt` allows indexing of the site and points crawlers at
  the sitemap; the Cart and Wishlist pages are excluded (personal, not useful
  in search results) and are also marked `noindex` directly.
- Product pages (`/products/:id`) get individual titles, descriptions, and
  social preview images pulled from that product's own data — editing a
  product's name/description/photo in the CMS updates its SEO automatically.

**One-time step for you:** submit `https://rnrfood.com/sitemap.xml` to
[Google Search Console](https://search.google.com/search-console) once the
site is live, so Google finds and indexes all your pages quickly.

## What's NOT covered by this CMS

To keep this simple and easy to maintain, a few things are still configured in
the website's code rather than through the admin panel: the page layout/styling
(CSS), product page dynamic elements (related products, size selector), the cart
and wishlist logic, and the SEO JSON-LD structured data. Everything that changes
often — products, prices, photos, categories, varieties, team, testimonials,
contact details, and all page text content — is fully editable through the CMS.
