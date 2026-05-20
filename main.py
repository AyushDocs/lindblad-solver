import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from solver import bloch_vector, steady_state, pauli_matrices, spin_operators
from channels import (
    amplitude_damping, dephasing, amplitude_damping_dephasing,
    t1_expected_decay, t2_expected_decay
)
from driven_tls import (
    resonant_drive, off_resonant_drive, compare_steady_state_analytical,
    steady_state_vs_drive, analytical_steady_state_driven
)
from visualization import (
    plot_bloch_sphere, plot_trajectory, plot_population_vs_time,
    plot_coherence_vs_time
)


def demo_t1_decay():
    print("\n=== T1 Amplitude Damping ===")
    T1 = 10.0
    tlist = np.linspace(0, 5 * T1, 200)

    rho0 = np.array([[1.0, 0.0], [0.0, 0.0]], dtype=complex)
    rhos = amplitude_damping(rho0, tlist, T1)

    rho0_excited = np.array([[0.0, 0.0], [0.0, 1.0]], dtype=complex)
    rhos_excited = amplitude_damping(rho0_excited, tlist, T1)

    fig, axes = plt.subplots(1, 3, figsize=(18, 5))

    plot_population_vs_time(tlist, rhos, labels=['|0⟩', '|1⟩'],
                            colors=['#2c7bb6', '#d7191c'], ax=axes[0])
    axes[0].set_title('T₁ decay (initial |0⟩)')
    axes[0].axvline(x=T1, color='gray', linestyle='--', alpha=0.5, label=f'T₁={T1}')

    plot_coherence_vs_time(tlist, rhos, ax=axes[1])
    axes[1].set_title('Coherence under T₁')

    blochs = np.array([bloch_vector(r) for r in rhos_excited])
    z_expected = t1_expected_decay(rho0_excited, tlist, T1)

    axes[2].plot(tlist, blochs[:, 2], 'b-', linewidth=2, label='Numerical')
    axes[2].plot(tlist, z_expected, 'r--', linewidth=2, label='Expected: exp(-t/T₁)')
    axes[2].set_xlabel('Time')
    axes[2].set_ylabel('⟨Z⟩')
    axes[2].set_title('T₁ decay of ⟨Z⟩')
    axes[2].legend()
    axes[2].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('fig_t1_decay.png', dpi=150)
    plt.close()
    print("  Saved fig_t1_decay.png")

    fig2, ax2 = plt.subplots(figsize=(7, 7), subplot_kw={'projection': '3d'})
    plot_bloch_sphere(ax2, title='T₁ Bloch trajectory')
    plot_trajectory(blochs, ax=ax2, color='darkorange')
    ax2.view_init(elev=20, azim=40)
    plt.tight_layout()
    plt.savefig('fig_t1_bloch.png', dpi=150)
    plt.close()
    print("  Saved fig_t1_bloch.png")


def demo_t2_dephasing():
    print("\n=== T₂ Dephasing ===")
    T2 = 10.0
    tlist = np.linspace(0, 5 * T2, 200)

    rho0 = np.array([[0.5, 0.5], [0.5, 0.5]], dtype=complex)
    rhos = dephasing(rho0, tlist, T2)

    fig, axes = plt.subplots(1, 3, figsize=(18, 5))

    plot_population_vs_time(tlist, rhos, labels=['|0⟩', '|1⟩'],
                            colors=['#2c7bb6', '#d7191c'], ax=axes[0])
    axes[0].set_title('T₂ dephasing — populations constant')

    plot_coherence_vs_time(tlist, rhos, ax=axes[1])
    axes[1].set_title('Coherence decay under T₂')
    axes[1].plot(tlist, np.exp(-tlist / T2), 'r--', linewidth=2,
                 label=f'exp(-t/T₂)')

    blochs = np.array([bloch_vector(r) for r in rhos])
    x_expected, y_expected = t2_expected_decay(rho0, tlist, T2)

    axes[2].plot(tlist, blochs[:, 0], 'b-', linewidth=2, label='⟨X⟩ numerical')
    axes[2].plot(tlist, x_expected, 'r--', linewidth=2, label='⟨X⟩ expected')
    axes[2].set_xlabel('Time')
    axes[2].set_ylabel('Coherence')
    axes[2].set_title('T₂ decay of off-diagonal elements')
    axes[2].legend()
    axes[2].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('fig_t2_dephasing.png', dpi=150)
    plt.close()
    print("  Saved fig_t2_dephasing.png")

    fig2, ax2 = plt.subplots(figsize=(7, 7), subplot_kw={'projection': '3d'})
    plot_bloch_sphere(ax2, title='T₂ Bloch trajectory')
    plot_trajectory(blochs, ax=ax2, color='green')
    ax2.view_init(elev=20, azim=40)
    plt.tight_layout()
    plt.savefig('fig_t2_bloch.png', dpi=150)
    plt.close()
    print("  Saved fig_t2_bloch.png")


def demo_both_t1_t2():
    print("\n=== Combined T₁ + T₂ ===")
    T1, T2 = 10.0, 5.0
    tlist = np.linspace(0, 5 * max(T1, T2), 200)

    rho0 = np.array([[0.5, 0.5j], [-0.5j, 0.5]], dtype=complex)
    rhos = amplitude_damping_dephasing(rho0, tlist, T1, T2)

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    plot_population_vs_time(tlist, rhos, labels=['|0⟩', '|1⟩'],
                            colors=['#2c7bb6', '#d7191c'], ax=axes[0])
    axes[0].set_title(f'T₁={T1}, T₂={T2} — populations')

    plot_coherence_vs_time(tlist, rhos, ax=axes[1])
    axes[1].set_title('Coherence under combined T₁ + T₂')
    axes[1].plot(tlist, np.exp(-tlist / T2), 'r--', linewidth=2,
                 label=f'exp(-t/T₂) envelope')

    plt.tight_layout()
    plt.savefig('fig_combined_t1_t2.png', dpi=150)
    plt.close()
    print("  Saved fig_combined_t1_t2.png")


def demo_driven_tls():
    print("\n=== Driven Two-Level System ===")
    Omega = 2.0
    gamma = 1.0
    tlist = np.linspace(0, 20, 500)

    rho0 = np.array([[1.0, 0.0], [0.0, 0.0]], dtype=complex)

    rhos_res = resonant_drive(Omega, gamma, rho0, tlist)

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    plot_population_vs_time(tlist, rhos_res, labels=['|0⟩', '|1⟩'],
                            colors=['#2c7bb6', '#d7191c'], ax=axes[0])
    axes[0].set_title('Resonant drive (Δ=0) — damped Rabi oscillations')
    steady_pops = np.diag(analytical_steady_state_driven(Omega, gamma)).real
    for i, c in enumerate(['#2c7bb6', '#d7191c']):
        axes[0].axhline(y=steady_pops[i], color=c, linestyle='--', alpha=0.6)

    blochs = np.array([bloch_vector(r) for r in rhos_res])

    axes[1].plot(tlist, blochs[:, 0], 'r-', linewidth=1.5, label='⟨X⟩')
    axes[1].plot(tlist, blochs[:, 1], 'g-', linewidth=1.5, label='⟨Y⟩')
    axes[1].plot(tlist, blochs[:, 2], 'b-', linewidth=1.5, label='⟨Z⟩')
    axes[1].axhline(y=0, color='gray', linestyle='--', alpha=0.3)
    axes[1].set_xlabel('Time')
    axes[1].set_ylabel('Bloch component')
    axes[1].set_title('Bloch vector vs time (resonant)')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('fig_driven_tls.png', dpi=150)
    plt.close()
    print("  Saved fig_driven_tls.png")

    fig2, (ax2a, ax2b) = plt.subplots(1, 2, figsize=(16, 7),
                                       subplot_kw={'projection': '3d'})
    plot_bloch_sphere(ax2a, title='Resonant drive trajectory')
    plot_trajectory(blochs, ax=ax2a, color='darkorange')
    ax2a.view_init(elev=20, azim=30)

    Delta = 3.0
    rhos_off = off_resonant_drive(Omega, Delta, gamma, rho0, tlist)
    blochs_off = np.array([bloch_vector(r) for r in rhos_off])
    plot_bloch_sphere(ax2b, title='Off-resonant drive (Δ=3)')
    plot_trajectory(blochs_off, ax=ax2b, color='purple')
    ax2b.view_init(elev=20, azim=30)

    plt.tight_layout()
    plt.savefig('fig_driven_tls_bloch.png', dpi=150)
    plt.close()
    print("  Saved fig_driven_tls_bloch.png")

    rho_ss_ana = analytical_steady_state_driven(Omega, gamma, Delta)
    rho_ss_num = steady_state(
        0.5 * Omega * pauli_matrices()[0] + 0.5 * Delta * pauli_matrices()[2],
        [spin_operators()[0]], [gamma]
    )
    r_ana = bloch_vector(rho_ss_ana)
    r_num = bloch_vector(rho_ss_num)
    print(f"\n  Steady state check (Ω={Omega}, γ={gamma}, Δ={Delta}):")
    print(f"    Analytical: r = ({r_ana[0]:.6f}, {r_ana[1]:.6f}, {r_ana[2]:.6f})")
    print(f"    Numerical:  r = ({r_num[0]:.6f}, {r_num[1]:.6f}, {r_num[2]:.6f})")


def demo_steady_state_sweep():
    print("\n=== Steady State vs Drive Strength ===")
    gamma = 1.0
    Omega_range = np.linspace(0, 10, 100)

    numerical, analytical = compare_steady_state_analytical(Omega_range, gamma)

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    axes[0].plot(Omega_range, numerical[:, 0], 'r-', linewidth=2, label='x (num)')
    axes[0].plot(Omega_range, numerical[:, 1], 'g-', linewidth=2, label='y (num)')
    axes[0].plot(Omega_range, numerical[:, 2], 'b-', linewidth=2, label='z (num)')
    axes[0].plot(Omega_range, analytical[:, 1], 'g--', linewidth=1.5, alpha=0.6, label='y (ana)')
    axes[0].plot(Omega_range, analytical[:, 2], 'b--', linewidth=1.5, alpha=0.6, label='z (ana)')
    axes[0].set_xlabel('Drive strength Ω')
    axes[0].set_ylabel('Steady-state Bloch component')
    axes[0].set_title(f'Steady state vs Ω (γ={gamma})')
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)

    diff = np.max(np.abs(numerical - analytical), axis=1)
    axes[1].semilogy(Omega_range, diff, 'k-', linewidth=2)
    axes[1].semilogy(Omega_range, np.full_like(Omega_range, 1e-14), 'r--',
                     linewidth=1, alpha=0.5, label='machine precision floor')
    axes[1].set_xlabel('Drive strength Ω')
    axes[1].set_ylabel('Max difference')
    axes[1].set_title('Numerical vs analytical agreement')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('fig_steady_state_sweep.png', dpi=150)
    plt.close()
    print("  Saved fig_steady_state_sweep.png")


def demo_all_noise_channels():
    print("\n=== All Noise Channels on Bloch Sphere ===")
    T1, T2 = 8.0, 4.0
    tlist = np.linspace(0, 20, 200)

    rho0 = np.array([[0.5, 0.5], [0.5, 0.5]], dtype=complex)

    rhos_ad = amplitude_damping(rho0, tlist, 1000.0)
    rhos_dp = dephasing(rho0, tlist, T2)
    rhos_both = amplitude_damping_dephasing(rho0, tlist, T1, T2)

    fig, axes = plt.subplots(1, 3, figsize=(21, 7),
                              subplot_kw={'projection': '3d'})

    for idx, (rhos_i, title, color) in enumerate([
        (rhos_ad, 'Amplitude Damping (weak)', 'blue'),
        (rhos_dp, 'Dephasing', 'green'),
        (rhos_both, 'T₁ + T₂ combined', 'red'),
    ]):
        blochs = np.array([bloch_vector(r) for r in rhos_i])
        plot_bloch_sphere(axes[idx], title=title)
        plot_trajectory(blochs, ax=axes[idx], color=color)
        axes[idx].view_init(elev=20, azim=40)

    plt.tight_layout()
    plt.savefig('fig_all_channels.png', dpi=150)
    plt.close()
    print("  Saved fig_all_channels.png")


def main():
    print("Lindblad Master Equation Solver — Demonstrations")
    print("=" * 50)

    demo_t1_decay()
    demo_t2_dephasing()
    demo_both_t1_t2()
    demo_all_noise_channels()
    demo_driven_tls()
    demo_steady_state_sweep()

    print("\n" + "=" * 50)
    print("All demonstrations complete!")
    print("Generated figures: ")
    print("  - fig_t1_decay.png")
    print("  - fig_t1_bloch.png")
    print("  - fig_t2_dephasing.png")
    print("  - fig_t2_bloch.png")
    print("  - fig_combined_t1_t2.png")
    print("  - fig_all_channels.png")
    print("  - fig_driven_tls.png")
    print("  - fig_driven_tls_bloch.png")
    print("  - fig_steady_state_sweep.png")


if __name__ == '__main__':
    main()
