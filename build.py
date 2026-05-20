import os
import sys
import base64
from io import BytesIO

sys.path.insert(0, os.path.dirname(__file__) or '.')

import matplotlib
matplotlib.use('Agg')
from matplotlib import pyplot as plt
import numpy as np

from solver import bloch_vector, pauli_matrices, spin_operators
from channels import amplitude_damping, dephasing
from driven_tls import resonant_drive, analytical_steady_state_driven, compare_steady_state_analytical


def capture(fig):
    buf = BytesIO()
    fig.savefig(buf, format='png', dpi=120, bbox_inches='tight')
    buf.seek(0)
    data = base64.b64encode(buf.read()).decode()
    plt.close(fig)
    return data


def build():
    print("Generating gallery data...")
    gallery = []

    T1, T2 = 10.0, 5.0

    tlist = np.linspace(0, 50, 200)
    rhos = amplitude_damping(np.array([[1.0, 0.0], [0.0, 0.0]], dtype=complex), tlist, T1)
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(tlist, np.array([bloch_vector(r)[2] for r in rhos]), 'b-', linewidth=2)
    ax.plot(tlist, 1 - np.exp(-tlist / T1), 'r--', linewidth=2, alpha=0.7)
    ax.set_xlabel('Time'); ax.set_ylabel('⟨Z⟩'); ax.set_title('T₁ Amplitude Damping')
    ax.grid(True, alpha=0.3)
    gallery.append(('T₁ Amplitude Damping', 'Ground-state population recovery from |1⟩.', capture(fig)))

    rhos = dephasing(np.array([[0.5, 0.5], [0.5, 0.5]], dtype=complex), tlist, T2)
    blochs = np.array([bloch_vector(r) for r in rhos])
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(tlist, blochs[:, 0], 'g-', linewidth=2, label='⟨X⟩')
    ax.plot(tlist, np.exp(-tlist / T2), 'r--', linewidth=2, label='exp(-t/T₂)')
    ax.set_xlabel('Time'); ax.set_ylabel('Coherence'); ax.set_title('T₂ Dephasing')
    ax.legend(); ax.grid(True, alpha=0.3)
    gallery.append(('T₂ Dephasing', 'Off-diagonal coherence decays exponentially.', capture(fig)))

    Omega, gamma = 2.0, 1.0
    tlist = np.linspace(0, 20, 500)
    rhos = resonant_drive(Omega, gamma, np.array([[1.0, 0.0], [0.0, 0.0]], dtype=complex), tlist)
    blochs = np.array([bloch_vector(r) for r in rhos])
    fig, ax = plt.subplots(figsize=(8, 4))
    for data, c, l in [(blochs[:, 0], 'r', '⟨X⟩'), (blochs[:, 1], 'g', '⟨Y⟩'), (blochs[:, 2], 'b', '⟨Z⟩')]:
        ax.plot(tlist, data, c, lw=1.5, label=l)
    r_ss = bloch_vector(analytical_steady_state_driven(Omega, gamma))
    for val, c in zip(r_ss, ['r', 'g', 'b']):
        ax.axhline(y=val, color=c, linestyle='--', alpha=0.5)
    ax.set_xlabel('Time'); ax.set_ylabel('Bloch component')
    ax.set_title('Damped Rabi Oscillations'); ax.legend(); ax.grid(True, alpha=0.3)
    gallery.append(('Damped Rabi Oscillations', 'Resonantly driven TLS with analytical steady state (dashed).', capture(fig)))

    Omega_range = np.linspace(0, 10, 100)
    numerical, analytical = compare_steady_state_analytical(Omega_range, gamma)
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(Omega_range, numerical[:, 0], 'r-', lw=2, label='x')
    ax.plot(Omega_range, numerical[:, 1], 'g-', lw=2, label='y')
    ax.plot(Omega_range, numerical[:, 2], 'b-', lw=2, label='z')
    ax.set_xlabel('Drive strength Ω'); ax.set_ylabel('Steady-state Bloch component')
    ax.set_title('Steady State vs Drive Strength'); ax.legend(); ax.grid(True, alpha=0.3)
    gallery.append(('Steady State vs Ω', 'Bloch components of the driven TLS steady state vs Rabi frequency.', capture(fig)))

    diff = np.max(np.abs(numerical - analytical), axis=1)
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.semilogy(Omega_range, diff, 'k-', lw=2)
    ax.semilogy(Omega_range, np.full_like(Omega_range, 1e-14), 'r--', lw=1, alpha=0.5)
    ax.set_xlabel('Ω'); ax.set_ylabel('Max |num − ana|')
    ax.set_title('Numerical vs Analytical Agreement'); ax.grid(True, alpha=0.3)
    gallery.append(('Validation: Numerical vs Analytical', 'Machine-precision agreement between numerical steady state and closed-form solution.', capture(fig)))

    api_dir = os.path.join(os.path.dirname(__file__) or '.', 'api')
    os.makedirs(api_dir, exist_ok=True)

    with open(os.path.join(api_dir, 'gallery_data.py'), 'w') as f:
        f.write("GALLERY = [\n")
        for title, desc, img in gallery:
            escaped_title = title.replace("'", "\\'")
            escaped_desc = desc.replace("'", "\\'")
            f.write(f"    ('{escaped_title}', '{escaped_desc}', '{img}'),\n")
        f.write("]\n")

    print(f"Gallery data written ({len(gallery)} items).")

    for title, desc, img in gallery:
        print(f"  {title}: {len(img)} bytes base64")


if __name__ == '__main__':
    build()
