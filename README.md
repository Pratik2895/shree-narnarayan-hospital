# Shree NarNarayan Children Hospital — Website

> **Live:** [shreenarnarayanhospital.in](https://shreenarnarayanhospital.in/) &nbsp;|&nbsp; **Rating:** ⭐ 5.0 (73 Google Reviews) &nbsp;|&nbsp; **Location:** Keshvam Square, Kudasan, Gandhinagar

Production-ready, single-page hospital website for **Shree NarNarayan Children Hospital** — a dedicated pediatric & neonatal facility in Kudasan, Gandhinagar, Gujarat.

Built with **vanilla HTML, CSS, and JavaScript** — zero build tools, zero dependencies. Deploys to any static host (GitHub Pages, Netlify, Vercel, cPanel).

---

## Features

### Core
- Fully responsive, mobile-first layout with animated hamburger navigation
- Sticky header with blur backdrop + scroll-aware active nav links (scroll spy)
- Floating WhatsApp & call buttons, back-to-top button
- Appointment form that composes a **pre-filled WhatsApp message** — no backend required
- Accessible: skip link, ARIA labels, keyboard navigation, `prefers-reduced-motion` support
- Lazy-loaded images with graceful error fallbacks

### SEO & Structured Data
- Meta tags, Open Graph, Twitter Cards, canonical URL
- **JSON-LD Schema:** `Hospital`, `FAQPage`, `Physician`, and `AggregateRating` (5.0 / 73 reviews)
- `sitemap.xml`, `robots.txt`, custom `404.html`, SVG favicon

### Autonomous / Smart Features
| Feature | Details |
|---|---|
| **Live OPD Status Badge** | Checks IST clock every 60 s — shows "OPD Open Now 🟢" or "OPD Closed 🔴" in the topbar |
| **Auto-rotating Testimonial Carousel** | 5 real Google reviews, rotates every 4.5 s, touch/swipe, pause on hover, responsive (1/2/3 slides) |
| **Floating Appointment CTA** | Appears after 8 s or 40% page scroll, dismissible with X |
| **FAQ Live Search** | Filters accordion items as you type; shows "no results" message |
| **Animated Counters** | Stats count up when scrolled into view |
| **Scroll Fade-in** | Cards and sections animate in via IntersectionObserver |

### Sections
Hero → Emergency Strip → About → Services (8) → Facilities (6) → **Doctors** → Vaccination Schedule → **Testimonials** → Working Hours → FAQ → Contact + Map → Footer

---

## File Structure

```
shree-narnarayan-hospital/
├── index.html          # Main page (all sections, JSON-LD, meta)
├── styles.css          # Design system + all responsive styles
├── script.js           # All interactivity (OPD status, carousel, FAQ search, form)
├── favicon.svg         # SVG favicon
├── 404.html            # Custom not-found page
├── robots.txt          # SEO crawler rules
├── sitemap.xml         # Site sitemap (update domain before going live)
├── widget-aisensy.html # AiSensy WhatsApp CRM activation guide
├── images/             # Doctor photos (used in production)
│   ├── dr-reshma.jpg
│   └── dr-avinash.jpg
└── image/              # High-resolution originals (PNG, not served)
    ├── Dr reshma.png
    └── Dr avinash.png
```

---

## Before Going Live

1. **Domain** — Update `robots.txt`, `sitemap.xml`, and the canonical + JSON-LD URLs in `index.html` (currently set to `https://shreenarnarayanhospital.in/`).

2. **Phone numbers**
   - Primary (calls): `tel:+918866663709`
   - WhatsApp / bookings: `wa.me/918530731365` and `const WHATSAPP_NUMBER = '918530731365'` in `script.js`

3. **OPD hours** — Confirmed **Mon–Sun, 9:00 AM – 5:00 PM** with 24x7 Emergency & NICU.  
   To change the live badge, edit `OPD_OPEN_HOUR` and `OPD_CLOSE_HOUR` in `script.js`.

4. **Doctor photos** — `images/dr-reshma.jpg` and `images/dr-avinash.jpg` are live.  
   Hero, About, Vaccine, and Gallery images are Unsplash placeholders — replace with real photos and update `index.html` (search for `images.unsplash.com`).

5. **Google rating** — Currently hardcoded as **5.0 / 73 reviews**. Update the `aggregateRating` JSON-LD block and `google-rating-summary` HTML whenever the count changes significantly.

---

## Deployment

Static site — drop the folder into any web host.

### GitHub Pages
```bash
git add .
git commit -m "Production-ready hospital website"
git push origin master
```
Then: repo → **Settings → Pages → deploy from branch `master` / root**.

### Netlify / Vercel
Drag-and-drop the folder into Netlify Drop, or connect the GitHub repo — works out of the box.

---

## WhatsApp CRM (Optional Upgrade)

| Tier | How |
|---|---|
| **Free (start today)** | Install **WhatsApp Business App** on `+91 85307 31365`. Every booking lands as a chat with full history. Add quick replies and a service catalog. |
| **Scale up** | Sign up with **AiSensy** (~Rs 999–1,500/mo). The site is pre-wired: paste point is marked in `index.html`, toggle `WHATSAPP_CRM_WIDGET_ACTIVE` is in `script.js`, and `widget-aisensy.html` has the step-by-step guide. |

**Upgrade path with AiSensy:**
- Connect `+91 85307 31365` via Meta Coexistence (keeps the Business App active)
- Generate the Website Chat Widget snippet → paste into `index.html`
- Set `WHATSAPP_CRM_WIDGET_ACTIVE = true` in `script.js`
- Build a booking flow: service → doctor → date → auto-confirmation with Maps link
- Enable push notifications for the doctor on every new booking
- Add T-24h / T-1h reminders (typically cuts no-shows 25–40%)

> **Compliance:** Follow the DPDP Act 2023 — capture patient consent for WhatsApp messaging and provide an opt-out (reply STOP). Emergencies must always direct to the phone helpline, never WhatsApp only.

---

## About the Hospital

| Detail | Info |
|---|---|
| **Established** | 2023 |
| **Size** | 4,000 sq ft, purpose-built |
| **NICU** | 12 beds, 24x7 |
| **Special rooms** | 10 (special + semi-special) |
| **General ward** | 4 beds |
| **Emergency room** | Round-the-clock |
| **In-house pharmacy** | Yes |
| **Children's play zone** | Yes |
| **Google rating** | 5.0 stars (73 reviews) |
| **Address** | Keshvam Square, 301-304, SMVS Hospital Road, Kudasan, Gandhinagar 382426 |
| **Phone** | +91 88666 63709 |
| **WhatsApp** | +91 85307 31365 |
