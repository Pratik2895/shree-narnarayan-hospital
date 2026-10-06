# Hostycare deployment

The static upload package is in `dist/`. It contains the complete website and assets, ready for Hostycare shared hosting/cPanel.

## Upload

1. In Hostycare Client Area, open the hosting service for `shreenarnarayanchildrenhospital.in` and launch cPanel.
2. Open **Domains** and confirm the domain's document root. Use the primary site's `public_html` only if this domain is configured as the primary domain; otherwise use the document root shown for this domain.
3. In **File Manager**, open that document root, back up or move aside any existing `index.html`/site files, then upload the *contents* of the local `dist/` folder. Keep the `images/` directory structure intact. Do not upload the parent folder as a nested subdirectory.
4. In **Domains** or **Zone Editor**, confirm the domain points to the hosting account's IP address. The current public lookup returned `127.0.0.1`, which is a local-only address and must not be used as a public A record. Use the IP and nameservers displayed for this Hostycare hosting service. If Hostycare is the registrar too, check its nameserver/DNS management; otherwise update DNS at the current registrar.
5. Enable/issue the free SSL certificate in cPanel (often **SSL/TLS Status** / AutoSSL), then verify both `https://shreenarnarayanchildrenhospital.in/` and `https://www.shreenarnarayanchildrenhospital.in/` resolve to the intended site. Configure the preferred hostname to redirect to the other if desired.

The exact DNS values depend on the Hostycare hosting service assigned to this account; they cannot be inferred from the domain alone. The domain and hosting account are separate products, so ensure an active web-hosting plan is attached before uploading.

## Package contents

`dist/` includes `index.html`, `styles.css`, `script.js`, `404.html`, `robots.txt`, `sitemap.xml`, favicon, and all referenced images. The contact/footer Instagram and map icons open the supplied Instagram profile and the hospital's Google Maps search.
