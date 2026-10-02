# Hospital photo integration

## Delivered

The website now uses 12 of the 13 supplied photographs: ten distinct hospital views and two doctor portraits. The repetitive waiting-area photo IMG_4448 remains unused. Originals in `Hospital/` were not edited.

The front reception replaces the hero and social preview. The waiting/play area appears in About, and the consultation room replaces the vaccination stock image with an accurate caption. Both doctor cards use individually cropped portraits. The ten-photo tour includes captioned full-frame thumbnails and an accessible enlarged-image dialog. Existing doctor names, qualifications, appointment flows and branding remain unchanged.

## Optimization

| Asset | Result |
| --- | --- |
| Original source collection | 63.43 MB |
| All exported variants, both formats | Approximately 13.32 MB on disk; never downloaded together |
| 420-pixel hero WebP | Approximately 23 KB |
| 840-pixel hero WebP | Approximately 71 KB |
| 480-pixel gallery WebPs | Approximately 10–35 KB each |
| Enlarged images | Each below 400,000 bytes in WebP and JPEG; maximum long edge 1920 pixels |
| Responsive variants | 99 images, plus a source/output manifest |

All exports are sRGB, orientation-normalized, and stripped of camera/GPS metadata. Photographer credits remain in the photographed pixels, visible gallery captions, and ASCII copyright metadata. The manifest records dimensions, byte counts, crop coordinates and encoder quality. Regeneration and verification commands are in README.md.

## Validation

- Checked 375, 768, 1024 and 1440-pixel layouts: one/two/two/three gallery columns and no horizontal overflow.
- Verified matching hero preload/image candidates and only one hero image request per tested viewport.
- Verified no source-original or enlarged-image downloads before opening the tour, including after scrolling through gallery thumbnails.
- Checked mouse and touch opening/navigation, previous/next wraparound, arrow keys, Escape, focus trapping and return to the opening thumbnail.
- Tested an intentionally failed enlarged-image request: useful error message and JPEG link appear; navigating to another photo recovers.
- Checked no-JavaScript navigation to enlarged JPEGs.
- Static validation checks 101 image references, ten tour links, structured-data JSON, exported dimensions/bytes, image budgets, GPS removal and copyright metadata.
- JavaScript syntax and Git whitespace checks pass.

## Local performance sample

Compared the previous checkout and updated page through the same local HTTP server in fresh Chromium contexts, at 375×812 / DPR 1, cache disabled, 150 ms latency and 200,000 bytes/second download bandwidth. External resources were blocked equally to isolate local page assets. These are single local measurements, not production Core Web Vitals or a Lighthouse score.

| Measurement | Previous page | Updated page |
| --- | --- | --- |
| LCP | 1.236 s | 1.308 s |
| Initial image transfer, including HTTP overhead | 39,788 bytes | 57,640 bytes |
| CLS | 0 | 0.044 |

The real imagery adds about 18 KB to initial image transfer in this sample. Layout-shift inspection traced the observed shift to the existing topbar/OPD-status area growing after initialization, not image dimensions. That pre-existing behavior also appeared intermittently in earlier baseline runs. External services and live deployment performance remain outside this local photo validation.

## Preview

Run `python -m http.server 8765 --bind 127.0.0.1`, then open http://127.0.0.1:8765/#hospital-tour. No deployment was performed. Only optimized assets are referenced by the site; the original `Hospital/` directory is not required for deployment.
