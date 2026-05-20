import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from mangum import Mangum

from gallery_data import GALLERY

app = FastAPI(title="Lindblad Master Equation Solver")

HTML_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lindblad Master Equation Solver</title>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0f172a; color: #e2e8f0; line-height: 1.6; }}
  header {{ background: linear-gradient(135deg, #1e293b, #0f172a);
            padding: 3rem 2rem; text-align: center; border-bottom: 1px solid #334155; }}
  header h1 {{ font-size: 2.2rem; background: linear-gradient(90deg, #38bdf8, #818cf8);
               -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
  header p {{ color: #94a3b8; margin-top: 0.5rem; font-size: 1.1rem; }}
  .container {{ max-width: 1000px; margin: 0 auto; padding: 2rem; }}
  .card {{ background: #1e293b; border-radius: 12px; margin-bottom: 2rem; overflow: hidden;
           border: 1px solid #334155; }}
  .card img {{ width: 100%; display: block; }}
  .card-body {{ padding: 1.5rem; }}
  .card-body h2 {{ font-size: 1.3rem; color: #38bdf8; margin-bottom: 0.5rem; }}
  .card-body p {{ color: #94a3b8; font-size: 0.95rem; }}
  footer {{ text-align: center; padding: 2rem; color: #475569; font-size: 0.85rem; }}
  footer a {{ color: #38bdf8; }}
</style>
</head>
<body>
<header>
  <h1>⚛ Lindblad Master Equation Solver</h1>
  <p>Open quantum systems — T₁/T₂ noise, driven TLS, Bloch sphere trajectories</p>
</header>
<div class="container">{cards}</div>
<footer>
  Built with NumPy + SciPy + Matplotlib &nbsp;|&nbsp;
  <a href="https://github.com/AyushDocs/lindblad-solver">GitHub</a>
</footer>
</body>
</html>"""


@app.get("/", response_class=HTMLResponse)
async def root():
    cards_html = ""
    for title, desc, img_data in GALLERY:
        cards_html += f'''<div class="card">
  <img src="data:image/png;base64,{img_data}" alt="{title}">
  <div class="card-body">
    <h2>{title}</h2>
    <p>{desc}</p>
  </div>
</div>'''
    return HTML_PAGE.format(cards=cards_html)


@app.get("/api/health")
async def health():
    return {"status": "ok", "figures": len(GALLERY)}


handler = Mangum(app)
