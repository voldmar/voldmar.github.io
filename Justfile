set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

serve:
    python3 -m http.server 8000

status:
    git status --short

build:
    just check

update-site message="Update site":
    just build
    git add -A
    if git diff --cached --quiet; then \
        echo "No changes to publish."; \
    else \
        git commit -m "{{message}}"; \
        git push origin main; \
    fi

check:
    #!/usr/bin/env python3
    from html.parser import HTMLParser
    from pathlib import Path

    class Parser(HTMLParser):
        pass

    for path in [Path('index.html'), Path('handle-generator/index.html'), Path('cat-puzzle-box/index.html')]:
        Parser().feed(path.read_text(encoding='utf-8'))
        print(f'parsed {path}')

    required = [
        Path('styles.css'),
        Path('handle-generator/index.html'),
        Path('cat-puzzle-box/styles.css'),
        Path('cat-puzzle-box/app.js'),
        Path('cat-puzzle-box/box-svg/top.svg'),
        Path('cat-puzzle-box/box-svg/bottom.svg'),
        Path('cat-puzzle-box/box-svg/sides.svg'),
        Path('cat-puzzle-box/box-svg/sandpaper-top.svg'),
        Path('cat-puzzle-box/box-svg/sandpaper-bottom.svg'),
        Path('cat-puzzle-box/box-svg/sandpaper-sides.svg'),
        Path('.agents/skills/impeccable/SKILL.md'),
    ]
    for path in required:
        if not path.exists():
            raise SystemExit(f'missing {path}')
