"""Offline asset preparation. Run with Python and Pillow; originals are never changed."""
import io
import json
from pathlib import Path
from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'images' / 'hospital'
CREDIT = 'PRASHANT PARMAR ARCHITECT | Copyright STUDIO_16MM'
PHOTOS = [
    ('reception-front', 'FACEBOOK COVERPHOTO.JPEG', 'Front reception', ['hero', 'tour', 'social']),
    ('reception-area', '2023_09_10_02_19_IMG_1414.JPEG', 'Reception area', ['tour']),
    ('waiting-play-area', '2023_08_23_11_25_IMG_4427.JPG.jpeg', 'Waiting area and children’s play zone', ['about', 'tour']),
    ('consultation-room', '2023_09_10_02_23_IMG_1423.JPEG', 'Consultation room', ['vaccination', 'tour']),
    ('opd-emergency-entrances', '2023_09_10_02_19_IMG_1416.JPEG', 'OPD and emergency-room entrances', ['tour']),
    ('nicu-entrance', '2023_09_10_02_27_IMG_1438.JPEG', 'NICU entrance and adjacent area', ['tour']),
    ('two-bed-room', '2023_09_10_02_31_IMG_1465.JPEG', 'Two-bed patient room', ['tour']),
    ('patient-room', '2023_09_10_02_38_IMG_1476.JPEG', 'Patient room with attendant seating', ['tour']),
    ('hospital-corridor', '2023_09_10_02_35_IMG_1471.JPEG', 'Hospital corridor', ['tour']),
    ('pharmacy', '2023_08_23_12_48_IMG_4430.JPG.jpeg', 'In-house pharmacy', ['tour']),
    ('dr-avinash', 'Dr Avinash.jpeg', 'Dr. Avinash Patel', ['doctors']),
    ('dr-reshma', 'Dr Reshma.jpeg', 'Dr. Reshma Bhikadiya', ['doctors']),
]
# Pixel coordinates in the orientation-normalized originals; matching face scale.
CROPS = {'dr-avinash': (1050, 1750, 2400, 3100), 'dr-reshma': (2550, 750, 4850, 3050)}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    report = []
    srgb = ImageCms.createProfile('sRGB')
    for slug, filename, caption, placements in PHOTOS:
        with Image.open(ROOT / 'Hospital' / filename) as source:
            im = ImageOps.exif_transpose(source)
            profile = im.info.get('icc_profile')
            if profile:
                im = ImageCms.profileToProfile(im, ImageCms.ImageCmsProfile(io.BytesIO(profile)), srgb, outputMode='RGB')
            else:
                im = im.convert('RGB')
            entry = dict(slug=slug, source='Hospital/' + filename, caption=caption, placements=placements,
                         source_dimensions=list(im.size), crop=CROPS.get(slug),
                         attribution=CREDIT if slug in ('waiting-play-area', 'pharmacy') else None, outputs=[])
            if slug in CROPS:
                im = im.crop(CROPS[slug])
            def save_variant(frame, suffix, formats=('webp', 'jpg')):
                # A fresh pixel image prevents camera EXIF/GPS from leaking into exports.
                clean = Image.new('RGB', frame.size)
                clean.paste(frame)
                exif = Image.Exif()
                if entry['attribution']:
                    exif[315] = entry['attribution']
                    exif[33432] = entry['attribution']
                for fmt in formats:
                    dest = OUT / f'{slug}-{suffix}.{fmt}'
                    options = dict(quality=82, exif=exif.tobytes())
                    options.update(dict(method=6) if fmt == 'webp' else dict(optimize=True, progressive=True))
                    clean.save(dest, **options)
                    if suffix == 'large':
                        while dest.stat().st_size > 400_000 and options['quality'] > 64:
                            options['quality'] -= 3
                            clean.save(dest, **options)
                    entry['outputs'].append(dict(path=dest.relative_to(ROOT).as_posix(), width=clean.width,
                                                 height=clean.height, bytes=dest.stat().st_size, quality=options['quality']))
            widths = [240, 480, 720] if slug in CROPS else [480, 960, 1440]
            if slug == 'reception-front':
                widths += [420, 840, 1260]
            for width in sorted(widths):
                save_variant(im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS), str(width))
            if slug not in CROPS:
                large = im.copy()
                large.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
                save_variant(large, 'large')
            if slug == 'reception-front':
                save_variant(ImageOps.fit(im, (1200, 630), method=Image.Resampling.LANCZOS, centering=(0.5, 0.42)), 'social', ('jpg',))
            report.append(entry)
    manifest = dict(colour_space='sRGB', quality=82, photos=report,
                    unused=[dict(source='Hospital/2023_08_23_12_30_IMG_4448.JPG.jpeg', reason='Similar waiting-area view with foreground motion blur')])
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    outputs = [o for p in report for o in p['outputs']]
    print(f'Generated {len(outputs)} images: {sum(o["bytes"] for o in outputs):,} bytes across all sizes and formats')
    for p in report:
        print(p['slug'], ', '.join(f'{Path(o["path"]).name}: {o["bytes"] // 1024} KiB' for o in p['outputs'] if o['path'].endswith(('-480.webp', '-840.webp', '-large.webp', '-large.jpg'))))

if __name__ == '__main__':
    main()
