# KHUSHPREET KARARIYA — Full-stack purple portfolio

An upgrade of the **existing purple/white/black** `khushpreet_purple_premium` portfolio project. The visual foundation and **original guitar photo** have been kept; the newer supplied portrait is included in About. Vanilla HTML/CSS/JS frontend, tasteful GSAP motion, REST API with Express, MongoDB Atlas via Mongoose, and a cookie-session-protected admin dashboard.

> **Read first:** This package contains genuine application code—not a hosted or pre-configured website. Project cards, skills, services, settings and contact messages use MongoDB; they will not load or save until **you connect your own MongoDB database**. Without a database, the public shell loads and the API explicitly returns **503**, never fake success. To verify production behavior, install packages, configure MongoDB, then run the tests and checklist. No deployment has been performed for you.

## What is implemented

- Responsive portfolio based on the original design, exactly three font families (**Syne, DM Sans, Instrument Serif**), purple `#7C3AED`, light/dark themes.
- Preserved rectangular original guitar hero photo. New supplied portrait, optimized as WebP, placed in About; image top corners remain square.
- Sticky animated navbar, project filtering, modal details and gallery, subtle button microinteractions, scroll-progress line, GSAP ScrollTrigger enhancements and reduced-motion support.
- Projects, skills, services, and public site content fetched from **actual MongoDB APIs**; administration can create, edit, delete, feature and reorder projects via `sortOrder`.
- Contact form: name, email, subject, project type, optional budget and message; server-side validation, honeypot field and rate limiting. MongoDB messages can be viewed, searched, marked read/unread and deleted privately.
- Authenticated admin dashboard with overview statistics, CRUD screens, image upload, About/hero/content/social/SEO/CV configuration, and password change.
- Cookie-based server-side sessions, bcrypt hashes, session regeneration at login, HTTP-only and SameSite cookies, secure-cookie mode on HTTPS, Helmet CSP, origin checks, per-session CSRF token for admin mutations, input limits, protected APIs, server-side authorization, file signature checking, and safe public rendering.
- MongoDB-backed sessions via `connect-mongo` when connected. Cloudinary image storage optional for production; local file upload only for development.
- Dynamic server-rendered root-page title, description, canonical URL and sitemap; public page metadata editable from admin. `robots.txt` excludes admin.

## Requirements

- Node.js **20+** and npm.
- MongoDB Atlas cluster (recommended) or local MongoDB server.
- Modern browser, internet access for Google Fonts and optional GSAP CDN.
- For persistent production image uploads: a **Cloudinary account** (optional until you upload custom covers).

## Windows 11 / VS Code — step-by-step

1. Extract the provided ZIP file. Open the `khushpreet_purple_premium` directory in VS Code (**File → Open Folder**).
2. Open VS Code Terminal (PowerShell) in this folder and run:

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

3. Create a free/test MongoDB Atlas deployment, create a database user, and allow **only your actual connection IP(s)** in Network Access. Paste the Atlas driver connection string into `MONGODB_URI` inside `.env`. URL-encode special characters in your database password. Example for locally installed MongoDB:

   ```dotenv
   MONGODB_URI=mongodb://127.0.0.1:27017/khushpreet_portfolio
   ```

4. Generate a fresh session secret (copy the printed result):

   ```powershell
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   Paste it as `SESSION_SECRET` in `.env`. Provide a private `ADMIN_EMAIL` and strong, unique `ADMIN_PASSWORD` (12+ characters). **Never copy your real `.env` into GitHub, screenshots or messages.**

5. Create your first administrator and sample portfolio content:

   ```powershell
   npm run setup:admin
   npm run seed
   ```

   These commands **do not overwrite an existing administrator or edited content**. Sample project descriptions distinguish concepts from completed work; review them before public launch.

6. Start the application:

   ```powershell
   npm run dev
   ```

7. Open your browser:

   - Website: **http://localhost:3000**
   - Admin login: **http://localhost:3000/admin/login.html**
   - Dashboard: **http://localhost:3000/admin/dashboard.html**
   - Database/API check: **http://localhost:3000/api/health**

   `api/health` should show `"database":"connected"`. After login, use the dashboard to update projects and content. Changes appear on the public website when refreshed.

> If you just double-click `public/index.html`, you see only a visual shell and MongoDB features will not work. **Use `npm run dev`** and configure a database.

### How to manage work

- **Projects** → Add/edit project title, slug, status, category, description, technologies, cover/gallery URLs, optional live/GitHub URLs, featured status and sort order. Lower `sortOrder` appears first.
- **Image upload** → Select a PNG/JPEG/WebP up to 5 MB, click **Upload cover**, then **Save changes**. Local development stores files in `public/uploads`. On a live server, configure Cloudinary to avoid losing uploads between redeploys.
- **Skills / Services** → Add, edit, delete and sort. Skills have optional proficiency percentage: absence of a score avoids implying expertise.
- **Messages** → Search, read, mark unread or delete genuine contact submissions.
- **Site content** → Hero text, About, timeline (`YEAR | milestone`), public email, social links, CV URL and SEO metadata.
- **Security** → Change admin password (the current session is logged out). To reset a forgotten admin password, use a secure manual recovery procedure on the server; the setup script does **not** silently reset accounts.

## API endpoints

| Public APIs | Purpose |
|---|---|
| `GET /api/health` | API and database health |
| `GET /api/projects`, `GET /api/projects/:slug` | Published projects |
| `GET /api/skills` | Skills |
| `GET /api/services` | Active services |
| `GET /api/site-settings` | Public content/settings |
| `POST /api/contact` | Validated and stored inquiry |

| Private APIs | Purpose |
|---|---|
| `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/session` | Authentication |
| `GET /api/admin/stats` | Dashboard stats |
| `GET/POST/PUT/DELETE /api/admin/projects[/:id]` | Project CRUD |
| `GET/POST/PUT/DELETE /api/admin/skills[/:id]` | Skills CRUD |
| `GET/POST/PUT/DELETE /api/admin/services[/:id]` | Services CRUD |
| `GET/PATCH/DELETE /api/admin/messages[/:id]` | Inbox search/status/delete |
| `GET/PUT /api/admin/settings` | Site content |
| `PUT /api/admin/password` | Change password |
| `POST /api/admin/upload` | Image upload |

APIs use consistent JSON (`{ok: true, data: ...}` or `{ok: false, error: ...}`). Admin mutation requests require both a valid login session and the `X-CSRF-Token` returned by `/api/admin/session`. Same-origin request checks reject external form posts.

## Testing

After `npm install`:

```powershell
npm run check
npm test
```

This runs JavaScript syntax checks plus Node.js tests for static assets, schemas, unauthorized dashboard access, API behavior when the DB is unavailable and origin protections. The MongoDB CRUD flows must also be tested using your Atlas account; a real database cannot be embedded into the ZIP.

**Manual end-to-end acceptance checklist:**

1. Database shows `connected` at `/api/health`.
2. Public projects/skills/services load from MongoDB after seeding.
3. Admin login succeeds with configured credentials; wrong credentials fail.
4. Admin can add, update, reorder and delete a project, skill and service; changes appear publicly.
5. Upload a test cover and confirm it appears in a project.
6. Submit contact form, confirm message stored in MongoDB and appears in private inbox.
7. Mark the message read/unread, filter/search, then delete it.
8. Confirm admin routes and dashboard deny unauthenticated requests.
9. Confirm invalid contact data and cross-origin requests are rejected.
10. Test keyboard navigation, mobile menu, dark theme and reduced-motion setting.
11. Inspect layout on phone/tablet/desktop and browser console for errors.

## Deployment: Render + MongoDB Atlas

1. Push this **source project (excluding `.env`)** to your own private or public GitHub repository.
2. Create a Render **Web Service** from that repository with Node runtime.
3. Configure the build command `npm ci` **if a lockfile exists**, otherwise `npm install`; start command `npm start`.
4. Add environment variables: `NODE_ENV=production`, `MONGODB_URI`, `SESSION_SECRET` (32+ random characters) and `PUBLIC_BASE_URL=https://YOUR_DOMAIN`.
5. Add Cloudinary `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` if using permanent project-image uploads.
6. Allow Render's outbound IP(s) in Atlas Network Access if known; if your chosen plan does not offer fixed outbound IPs, configure appropriate database network restrictions and credentials according to Atlas/Render documentation. Avoid overly broad network access wherever possible.
7. **Before exposing the admin login**, securely create the first account using the setup script with `ADMIN_EMAIL` and `ADMIN_PASSWORD` set only during setup, then remove `ADMIN_PASSWORD` from the production environment. Alternatively seed your initial admin through a secured temporary deployment job.
8. Attach your custom domain under Render's domain settings and set matching DNS records at your registrar. Ensure HTTPS is active. Configure `PUBLIC_BASE_URL` for canonical/sitemap links.
9. Verify all real API and admin actions **on the deployed URL** before announcing the site.

**Security considerations:** Default `express-session` MemoryStore is used **only in development without MongoDB** to show the shell. Production requires MongoDB and saves sessions to a MongoDB `sessions` collection. Cloudinary is recommended because Render's local file storage is generally ephemeral. Do not enable public admin signup or put passwords in browser JavaScript. Keep server packages updated and conduct production security review before using with sensitive client data.

## Common troubleshooting

- **`Database not connected` / 503** → check `MONGODB_URI`, Atlas network rules, URL-encoded DB user password and that your cluster is awake.
- **`npm` not recognized** → install Node.js 20+ and reopen the terminal.
- **Admin already exists** → by design, `setup:admin` is not a reset tool.
- **`Invalid CSRF token`** → reload the dashboard and sign in again.
- **Contact form has an error** → inspect `/api/health`; a real MongoDB connection is required. No false success messages are shown.
- **Uploaded photos disappear in production** → configure Cloudinary and re-upload persistent images; local disk uploads are intended for development only.
- **GSAP animations missing offline** → CDN may be blocked; the site remains navigable with CSS-only interaction and no scroll hijacking.
- **Port already used** → change `PORT` in `.env` and restart the server.

## File structure

```text
khushpreet_purple_premium/
├── public/
│   ├── index.html                  # original design upgraded with dynamic sections
│   ├── styles.css                  # original styles + dark theme + animation system
│   ├── app.js                      # public MongoDB-powered browser UX
│   ├── assets/                     # original guitar photo + newly uploaded portrait
│   ├── admin/                      # secured login + working management UI
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── app.js                      # Express API, sessions, file upload, security
│   ├── models.js                   # six Mongoose models
│   ├── validation.js               # server-side Zod schemas
│   └── mongo.js                    # database connection
├── scripts/
│   ├── setup-admin.js              # one-time secure admin creation
│   └── seed.js                     # non-destructive sample content
├── tests/                         # static, input-validation, HTTP checks
├── server.js                       # application startup
├── package.json
├── .env.example
└── README.md
```

## Current verification and limitation

JavaScript syntax and dependency-free source checks were run while packaging. This execution environment could not download npm dependencies and had no user-supplied MongoDB Atlas connection, so **an actual login, MongoDB CRUD, image upload to Cloudinary and deployed browser integration were NOT tested here**. Run the documented tests and checklist in your own environment before considering this a verified production launch.
