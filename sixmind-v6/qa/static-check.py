from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
errors=[]
required=['index.html','privacy.html','terms.html','src/main.js','src/future-tech.js','src/f11-f15.js','src/f16-f20.css']
for p in required:
    if not (root/p).exists(): errors.append(f'missing {p}')
html=(root/'index.html').read_text(encoding='utf-8')
ids=re.findall(r'id=["\']([^"\']+)',html)
for x in sorted(set(ids)):
    if ids.count(x)>1: errors.append(f'duplicate id {x}')
refs=re.findall(r'(?:src|href)=["\']([^"\']+)',html)
for ref in refs:
    if ref.startswith(('http:','https:','#','mailto:','tel:','data:')): continue
    clean=ref.split('?')[0].split('#')[0]
    if clean and not (root/clean).exists(): errors.append(f'broken ref {ref}')
js=list((root/'src').glob('*.js'))
if not js: errors.append('no js files')
print(f'checked {len(ids)} ids, {len(refs)} refs, {len(js)} js files')
if errors:
    print('\n'.join('ERROR '+e for e in errors))
    sys.exit(1)
print('STATIC QA OK')
