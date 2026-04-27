# The Watch Locator — v2 (Headless)

Headless WordPress + WooCommerce backend with a Next.js 15 frontend. All three services run via Docker Compose.

## Stack

| Service | Tech | Host port |
|---------|------|-----------|
| `frontend` | Next.js 15 (App Router), TypeScript, Tailwind | **3001** |
| `wordpress` | WP latest + WooCommerce + minimal `headless-shim` theme | **8081** |
| `db` | MySQL 8.0, seeded from `seed/dump.sql` on first start | (internal) |

The original v1 site keeps running on port 8080 — v2 uses 8081 + 3001 to avoid conflicts.

## Quick start

```bash
cd "/Users/to/cursor local/the-watch-locator-v2"
docker compose up -d --build
```

First boot takes a few minutes:

1. `db` initialises and loads `seed/dump.sql` automatically (via `/docker-entrypoint-initdb.d/`).
2. `wordpress` boots, copies WP core into the volume, then the entrypoint:
   - copies `seed/uploads-backup/` into `wp-content/uploads/`,
   - rewrites `siteurl` / `home` to `http://localhost:8081`,
   - installs and activates WooCommerce,
   - activates the `headless-shim` theme,
   - flushes rewrites.
   A `.twl-initialized` sentinel marks completion so the script skips on later boots.
3. `frontend` builds the Next.js production bundle and listens on 3000.

Then visit:

- **Storefront:** http://localhost:3001
- **WP admin:** http://localhost:8081/wp-admin (admin user comes from the imported dump)

## Verify

```bash
# Backend smoke
curl -s http://localhost:8081/wp-json/ | head -c 200
curl -s http://localhost:8081/wp-json/wc/store/v1/products | head -c 400
curl -s http://localhost:8081/wp-json/wp/v2/watch_submission

# CORS preflight
curl -i -H "Origin: http://localhost:3001" -X OPTIONS \
     http://localhost:8081/wp-json/wc/store/v1/cart
```

## Folder layout

```
.
├── docker-compose.yml
├── seed/
│   ├── dump.sql                  # auto-loaded into the db container
│   └── uploads-backup/           # auto-copied into wp-content/uploads on first boot
├── wordpress/
│   ├── Dockerfile                # wordpress:6.6-php8.3-apache + wp-cli
│   ├── entrypoint.sh             # idempotent first-run init
│   └── headless-shim/            # the only theme — no rendering
│       ├── style.css
│       ├── functions.php
│       ├── index.php
│       └── inc/
│           ├── cors.php          # opens CORS for http://localhost:3001
│           ├── watch-submission.php  # CPT + POST /wp-json/twl/v1/sell-your-watch
│           ├── contact-route.php     # POST /wp-json/twl/v1/contact
│           └── redirect.php          # 302s direct frontend visits to Next.js
└── frontend/
    ├── Dockerfile                # multi-stage node:20-alpine
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── src/
        ├── app/                  # App Router pages + route handlers
        ├── components/           # Header, Footer, Hero, ImageGrid, ProductCard
        ├── lib/                  # store-api wrapper + types
        └── styles/globals.css
```

## API contract

The frontend never talks to WordPress directly from the browser. It calls Next.js route handlers that proxy to WP:

| Frontend call | Proxies to | Purpose |
|---------------|-----------|---------|
| `GET /api/cart` | `GET /wp-json/wc/store/v1/cart` | Read cart (forwards `Cart-Token` cookie) |
| `POST /api/cart/add` | `POST /wp-json/wc/store/v1/cart/add-item` | Add line item |
| `POST /api/cart/remove` | `POST /wp-json/wc/store/v1/cart/remove-item` | Remove line item |
| `POST /api/checkout` | `POST /wp-json/wc/store/v1/checkout` | Place order (BACS in dev) |
| `POST /api/sell` | `POST /wp-json/twl/v1/sell-your-watch` | Create `watch_submission` post |
| `POST /api/contact` | `POST /wp-json/twl/v1/contact` | Send admin email |

Server components fetch products via `getProducts()` / `getProductBySlug()` directly against the internal `http://wordpress` hostname for ISR.

## Common tasks

```bash
# Logs
docker compose logs -f wordpress
docker compose logs -f frontend

# Reset everything (drops volumes — destructive)
docker compose down -v

# Re-run init (after a manual change inside the WP container)
docker compose exec wordpress rm -f /var/www/html/.twl-initialized
docker compose restart wordpress

# Refresh the DB seed
docker compose exec db mysqldump -uwordpress -pwordpress wordpress > seed/dump.sql

# Refresh the uploads seed
docker compose cp wordpress:/var/www/html/wp-content/uploads/. seed/uploads-backup/
```

## What's intentionally not here

- **A real payment gateway.** Checkout uses BACS — orders land in WP admin and the customer is told you'll be in touch. Wire Stripe / Klarna later.
- **Customer accounts / SSO.** Guest checkout only for v1.
- **Old theme rendering.** `header.php`, `front-page.php`, `template-parts/`, theme JS/CSS — all dropped. The Next.js app owns the UI end-to-end.
