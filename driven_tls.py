import numpy as np
from solver import lindblad_solve, steady_state, bloch_vector, pauli_matrices, spin_operators


def analytical_steady_state_driven(Omega, gamma, Delta=0.0):
    """Analytical steady state for H = (Ω/2)σ_x + (Δ/2)σ_z + amplitude damping.
    
    Bloch equations:
      dx/dt = -Δ y - (γ/2) x
      dy/dt =  Δ x - Ω z - (γ/2) y
      dz/dt =  Ω y + γ(1 - z)
    
    Steady-state Bloch vector:
      x_ss =  4ΩΔ / (γ² + 2Ω² + 4Δ²)
      y_ss = -2Ωγ / (γ² + 2Ω² + 4Δ²)
      z_ss =  (γ² + 4Δ²) / (γ² + 2Ω² + 4Δ²)
    """
    sx, sy, sz = pauli_matrices()

    denom = gamma**2 + 2 * Omega**2 + 4 * Delta**2
    x_ss = 4 * Omega * Delta / denom
    y_ss = -2 * Omega * gamma / denom
    z_ss = (gamma**2 + 4 * Delta**2) / denom

    rho_ss = 0.5 * (np.eye(2) + x_ss * sx + y_ss * sy + z_ss * sz)
    return rho_ss


def resonant_drive(Omega, gamma, rho0, tlist, method='expm'):
    sx, sy, sz = pauli_matrices()
    sm, sp = spin_operators()

    H = 0.5 * Omega * sx
    L_list = [sm]
    gamma_list = [gamma]

    return lindblad_solve(H, rho0, tlist, L_list, gamma_list, method)


def off_resonant_drive(Omega, Delta, gamma, rho0, tlist, method='expm'):
    sx, sy, sz = pauli_matrices()
    sm, sp = spin_operators()

    H = 0.5 * Omega * sx + 0.5 * Delta * sz
    L_list = [sm]
    gamma_list = [gamma]

    return lindblad_solve(H, rho0, tlist, L_list, gamma_list, method)


def steady_state_vs_drive(Omega_range, gamma, Delta=0.0):
    sx, sy, sz = pauli_matrices()
    sm, sp = spin_operators()

    bloch_ss = []
    for Omega in Omega_range:
        H = 0.5 * Omega * sx + 0.5 * Delta * sz
        rho_ss = steady_state(H, [sm], [gamma])
        bloch_ss.append(bloch_vector(rho_ss))

    return np.array(bloch_ss)


def compare_steady_state_analytical(Omega_range, gamma):
    numerical = steady_state_vs_drive(Omega_range, gamma)
    analytical = np.array([
        bloch_vector(analytical_steady_state_driven(Omega, gamma))
        for Omega in Omega_range
    ])
    return numerical, analytical
