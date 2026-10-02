"""Validate exported photos and HTML references without a browser."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('src', 'href', 'data-webp', 'content'):
            value = attrs.get(key, '').removeprefix('https://shreenarnarayanhospital.in/')
            if value.startswith('images/'):
                self.paths.add(value)
        for key in ('srcset', 'imagesrcset'):
            for candidate in attrs.get(key, '').split(','):
                if candidate.strip().startswith('images/'):
                    self.paths.add(candidate.strip().split()[0])

html = (ROOT / 'index.html').read_text(encoding='utf-8')
refs = References()
refs.feed(html)
for script in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
    json.loads(script)
    refs.paths.update(re.findall(r'https://shreenarnarayanhospital.in/(images/[^"\s]+)', script))
assert not re.search(r'(?:src|href)="Hospital/', html)
assert html.count('class="tour-photo"') == 10
for path in refs.paths:
    assert (ROOT / path).is_file(), path
manifest = json.loads((ROOT / 'images/hospital/manifest.json').read_text(encoding='utf-8'))
for photo in manifest['photos']:
    for output in photo['outputs']:
        path = ROOT / output['path']
        with Image.open(path) as image:
            assert image.size == (output['width'], output['height']), path
            assert path.stat().st_size == output['bytes'], path
            assert 34853 not in image.getexif(), f'GPS metadata: {path}'
            if '-large.' in path.name:
                assert max(image.size) <= 1920 and output['bytes'] < 400_000, path
            if photo['attribution']:
                assert image.getexif().get(33432) == photo['attribution'], path
print(f'PASS: {len(refs.paths)} image references, 10 tour links, structured data, export dimensions, file budgets, metadata and credits.')
