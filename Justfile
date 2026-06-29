set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

serve:
    python3 -m http.server 8000

status:
    git status --short

check:
    #!/usr/bin/env python3
    from html.parser import HTMLParser
    from pathlib import Path

    class Parser(HTMLParser):
        pass

    for path in [Path('index.html'), Path('handle-generator/index.html')]:
        Parser().feed(path.read_text(encoding='utf-8'))
        print(f'parsed {path}')

    required = [
        Path('styles.css'),
        Path('handle-generator/index.html'),
        Path('.agents/skills/impeccable/SKILL.md'),
    ]
    for path in required:
        if not path.exists():
            raise SystemExit(f'missing {path}')
