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
| **Privacy-friendly Analytics** | First-party Supabase funnel, traffic, device, and page-load events without appointment personal data |

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
├── ANALYTICS.md        # Event definitions and aggregate reporting queries
├── images/             # Web assets; optimized client photos in hospital/
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
   - WhatsApp / bookings: `wa.me/918866663709` and `const WHATSAPP_NUMBER = '918866663709'` in `script.js`

3. **OPD hours** — **Mon–Sat, Morning 10:00 AM – 1:00 PM & Evening 5:00 – 8:00 PM** with 24x7 Emergency & NICU.  
   To change the live badge, edit `OPD_SESSIONS` in `script.js`.

4. **Hospital photography** — Real client photographs now appear in the hero, About, hospital tour, doctor cards, vaccination section, and social preview. See the regeneration instructions below.

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
| **Free (start today)** | Install **WhatsApp Business App** on `+91 88666 63709`. Every booking lands as a chat with full history. Add quick replies and a service catalog. |
| **Scale up** | Sign up with **AiSensy** (~Rs 999–1,500/mo). The site is pre-wired: paste point is marked in `index.html`, toggle `WHATSAPP_CRM_WIDGET_ACTIVE` is in `script.js`, and `widget-aisensy.html` has the step-by-step guide. |

**Upgrade path with AiSensy:**
- Connect `+91 88666 63709` via Meta Coexistence (keeps the Business App active)
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
| **WhatsApp** | +91 88666 63709 |


## Hospital photography

The site serves optimized assets from `images/hospital/`. `Hospital/` contains the untouched client originals and is not referenced by the page. Keep the originals available locally for regeneration; they are not needed in the deployed site.

- Front reception is the hero and social preview; the waiting/play area is used in About.
- The ten-photo tour beneath Facilities includes reception, waiting/play area, consultation room, OPD/emergency entrances, NICU entrance, patient rooms, corridor, and pharmacy.
- Doctor cards use individual square crops. The vaccination image is accurately captioned “Consultation room.”
- IMG_4448 is retained as an unused alternative because it repeats the waiting-area view and has foreground motion blur.
- Visible photographer credits remain intact. Exported EXIF retains ASCII attribution but removes camera/GPS metadata.

### Regenerate images

Requires Python 3 and Pillow (offline tooling only; no website runtime dependency):

```powershell
python -m pip install Pillow
python scripts/prepare_hospital_photos.py
python scripts/check_hospital_photos.py
node --check script.js
```

The generator normalizes orientation and sRGB colour, prepares WebP/JPEG variants, and writes `images/hospital/manifest.json` with source mappings, crop coordinates, captions, placements, dimensions, bytes and encoder quality. Originals are never overwritten. Adjust the `PHOTOS` list or `CROPS` mapping to change assets; update the corresponding HTML when changing names, captions, or placements. JPEG quality for enlarged views is lowered only as needed to meet the 400,000-byte budget.

The hero preload and picture use matching responsive candidates. Below-fold images load lazily, while enlarged files are requested only after opening the tour. The dialog supports touch buttons, arrow keys, Escape, focus containment/restoration, and load-error recovery. Without JavaScript, links open the enlarged JPEG directly.

### Local preview

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Visit http://127.0.0.1:8765/#hospital-tour. See `PHOTO_INTEGRATION_REPORT.md` for validation and optimization results.
