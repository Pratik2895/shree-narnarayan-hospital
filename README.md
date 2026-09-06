# Shree NarNarayan Children Hospital — Website

Production-ready, single-page marketing website for **Shree NarNarayan Children Hospital**, Kudasan, Gandhinagar — a dedicated pediatric & neonatal hospital.

Built with **vanilla HTML, CSS, and JavaScript** — no build tools, deploys anywhere (GitHub Pages, Netlify, Vercel, cPanel).

## Features

- Fully responsive, mobile-first layout with an accessible navigation menu
- SEO-ready: meta tags, Open Graph, Twitter cards, FAQ + Hospital JSON-LD structured data, canonical URL
- `sitemap.xml`, `robots.txt`, custom `404.html`, and SVG favicon
- Booking/contact form that composes a **pre-filled WhatsApp message** (no backend needed)
- Floating WhatsApp & call buttons, sticky header, back-to-top button
- Sections: Hero, Emergency strip, About, Services, Facilities (NICU, wards, emergency), Doctors, Vaccination schedule, Testimonials, Working hours, FAQ, Contact + Google Map
- Respects `prefers-reduced-motion`; images lazily loaded with graceful fallbacks

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Main page (all sections) |
| `styles.css` | Complete design system & responsive styles |
| `script.js` | Interactivity: menu, scrollspy, FAQ accordion, counters, WhatsApp form |
| `favicon.svg` | Site favicon |
| `404.html` | Custom not-found page |
| `images/` | Local doctor photos (`dr-reshma.jpg`, `dr-avinash.jpg`) |
| `widget-aisensy.html` | AiSensy activation checklist & widget paste point |
| `robots.txt` / `sitemap.xml` | SEO helpers (configure to your real domain) |

## Before going live

1. **Phone numbers** (calls): `tel:+918866663709` (primary) and `tel:+918530731365` (alternate) in `index.html`.
2. **WhatsApp number** (bookings & notifications): all WhatsApp buttons and the booking form send to `+91 85307 31365` (the doctor's line) via `wa.me/918530731365` and `const WHATSAPP_NUMBER = '918530731365';` in `script.js`. Install the WhatsApp Business App on this number to get notified of every booking and keep your chat history.
2. **Photos**: the two doctor photos (`images/dr-reshma.jpg`, `images/dr-avinash.jpg`) are local. The hero, about, vaccine, and gallery sections still use Unsplash CDN placeholders — replace them with real photos in `images/` and update `index.html` (look for `images.unsplash.com` URLs).
3. **Set the real domain** in `robots.txt`, `sitemap.xml`, `index.html` (canonical + JSON-LD URLs) — currently `https://shreenarnarayanhospital.in/`.
4. **Update the contact email** in the footer/contact if you add one.
5. Confirm OPD timings — site shows **Mon–Sun 9:00 AM–5:00 PM** with **24x7 emergency/NICU**, per Practo & Google listings.

## WhatsApp CRM upgrade (optional)

For appointment history, booking bots, auto-reminders, and a team inbox where doctors get notified, connect the WhatsApp Business API through a BSP:

1. **Start today (free):** Install the **WhatsApp Business App** on `+91 85307 31365`. Every booking from the site lands there as a chat — history is kept in the app and the doctor is notified instantly. Add quick replies and a catalog for services.
2. **Scale up (recommended):** Sign up with **AiSensy** (~₹999–1,500/mo, unlimited agents, free green tick, Indian support). **The site is already prepared** — the paste point for the widget snippet is marked in `index.html` (right after `<body>`), the switch `WHATSAPP_CRM_WIDGET_ACTIVE` is ready in `script.js`, and `widget-aisensy.html` is a step-by-step activation checklist. Then:
   - Connect `+91 85307 31365` to AiSensy (Meta Coexistence keeps the Business App working on the same number).
   - Generate the **Website Chat Widget** snippet in AiSensy and paste it where the marker sits in `index.html`, then set `WHATSAPP_CRM_WIDGET_ACTIVE = true`.
   - Build a **booking flow** in the Flow Builder: patient picks service → doctor → date/time → auto-confirmation with the Google Maps link.
   - Set the **team inbox** so the doctor receives a push notification on every new booking, and ticket/assign chats.
   - Add **reminders** (T-24h / T-1h) and follow-ups — typically cut no-shows 25–40%.
   - Enable **Google Calendar sync** so the doctor's availability stays accurate.
3. Keep the plan: WhatsApp is for bookings/reminders only — emergencies should always call.

> Compliance: follow the DPDP Act 2023 — capture patient consent for WhatsApp messaging and provide an opt-out (reply STOP). Never use WhatsApp as the emergency channel; always display the phone helpline.

## Deployment

Static site — drop the files into any web host. For GitHub Pages:

```bash
git add .
git commit -m "Production-ready hospital website"
git push origin master
```

Then enable Pages under repo → Settings → Pages → deploy from branch `master` / root.

> The hospital itself — built 2023, 4,000 sq ft, 12-bed NICU, 2 OPDs, 10 special beds, 4-bed general ward, emergency room, and in-house medical store.