import matplotlib
matplotlib.use('Agg')

import os
import sys
import base64
from io import BytesIO

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from mangum import Mangum

import numpy as np
from solver import bloch_vector, steady_state, pauli_matrices, spin_operators
from channels import amplitude_damping, dephasing, amplitude_damping_dephasing
from driven_tls import resonant_drive, analytical_steady_state_driven, compare_steady_state_analytical

app = FastAPI(title="Lindblad Master Equation Solver")

GALLERY = []

def capture_fig(fig):
    buf = BytesIO()
    fig.savefig(buf, format='png', dpi=120, bbox_inches='tight')
    buf.seek(0)
    data = base64.b64encode(buf.read()).decode()
    from matplotlib import pyplot as plt
    plt.close(fig)
    return data


def build_gallery():
    global GALLERY
    GALLERY = []

    from matplotlib import pyplot as plt

    T1, T2 = 10.0, 5.0
    tlist = np.linspace(0, 50, 200)
    rho0 = np.array([[1.0, 0.0], [0.0, 0.0]], dtype=complex)
    rhos = amplitude_damping(rho0, tlist, T1)

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(tlist, np.array([bloch_vector(r)[2] for r in rhos]), 'b-', linewidth=2)
    ax.plot(tlist, 1 - np.exp(-tlist / T1), 'r--', linewidth=2, alpha=0.7)
    ax.set_xlabel('Time'); ax.set_ylabel('⟨Z⟩'); ax.set_title('T₁ Amplitude Damping')
    ax.grid(True, alpha=0.3)
    GALLERY.append(('T₁ Amplitude Damping', 'Ground-state population recovery from |1⟩.', capture_fig(fig)))

    tlist = np.linspace(0, 50, 200)
    rho0 = np.array([[0.5, 0.5], [0.5, 0.5]], dtype=complex)
    rhos = dephasing(rho0, tlist, T2)
    blochs = np.array([bloch_vector(r) for r in rhos])
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(tlist, blochs[:, 0], 'g-', linewidth=2, label='⟨X⟩')
    ax.plot(tlist, np.exp(-tlist / T2), 'r--', linewidth=2, label='exp(-t/T₂)')
    ax.set_xlabel('Time'); ax.set_ylabel('Coherence'); ax.set_title('T₂ Dephasing')
    ax.legend(); ax.grid(True, alpha=0.3)
    GALLERY.append(('T₂ Dephasing', 'Off-diagonal coherence decays exponentially.', capture_fig(fig)))

    Omega, gamma = 2.0, 1.0
    tlist = np.linspace(0, 20, 500)
    rho0 = np.array([[1.0, 0.0], [0.0, 0.0]], dtype=complex)
    rhos = resonant_drive(Omega, gamma, rho0, tlist)
    blochs = np.array([bloch_vector(r) for r in rhos])
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(tlist, blochs[:, 0], 'r-', lw=1.5, label='⟨X⟩')
    ax.plot(tlist, blochs[:, 1], 'g-', lw=1.5, label='⟨Y⟩')
    ax.plot(tlist, blochs[:, 2], 'b-', lw=1.5, label='⟨Z⟩')
    r_ss = bloch_vector(analytical_steady_state_driven(Omega, gamma))
    for i, (c, l) in enumerate(zip(['r', 'g', 'b'], ['x', 'y', 'z'])):
        ax.axhline(y=r_ss[i], color=c, linestyle='--', alpha=0.5)
    ax.set_xlabel('Time'); ax.set_ylabel('Bloch component')
    ax.set_title('Damped Rabi Oscillations'); ax.legend(); ax.grid(True, alpha=0.3)
    GALLERY.append(('Damped Rabi Oscillations', 'Resonantly driven TLS with dashed lines showing the analytical steady state.', capture_fig(fig)))

    Omega_range = np.linspace(0, 10, 100)
    numerical, analytical = compare_steady_state_analytical(Omega_range, gamma)
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(Omega_range, numerical[:, 0], 'r-', lw=2, label='x')
    ax.plot(Omega_range, numerical[:, 1], 'g-', lw=2, label='y')
    ax.plot(Omega_range, numerical[:, 2], 'b-', lw=2, label='z')
    ax.set_xlabel('Drive strength Ω'); ax.set_ylabel('Steady-state Bloch component')
    ax.set_title('Steady State vs Drive Strength'); ax.legend(); ax.grid(True, alpha=0.3)
    GALLERY.append(('Steady State vs Ω', 'Bloch components of the driven TLS steady state as a function of Rabi frequency.', capture_fig(fig)))

    Omega_range = np.linspace(0, 10, 100)
    numerical, analytical = compare_steady_state_analytical(Omega_range, gamma)
    diff = np.max(np.abs(numerical - analytical), axis=1)
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.semilogy(Omega_range, diff, 'k-', lw=2)
    ax.semilogy(Omega_range, np.full_like(Omega_range, 1e-14), 'r--', lw=1, alpha=0.5)
    ax.set_xlabel('Ω'); ax.set_ylabel('Max |num − ana|')
    ax.set_title('Numerical vs Analytical Agreement'); ax.grid(True, alpha=0.3)
    GALLERY.append(('Validation: Numerical vs Analytical', 'Difference between numerical steady state and closed-form analytical solution — machine-precision agreement.', capture_fig(fig)))


build_gallery()

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
  .badge {{ display: inline-block; background: #334155; color: #94a3b8; padding: 0.2rem 0.6rem;
            border-radius: 4px; font-size: 0.75rem; margin-top: 0.5rem; }}
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
  <a href="https://github.com/ayusharyan7/lindblad-solver">GitHub</a>
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
