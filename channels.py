import numpy as np
from solver import lindblad_solve, steady_state, bloch_vector, spin_operators, pauli_matrices


def amplitude_damping(rho0, tlist, T1, method='expm'):
    H = np.zeros((2, 2), dtype=complex)
    sm, sp = spin_operators()
    L_list = [sm]
    gamma_list = [1.0 / T1]
    return lindblad_solve(H, rho0, tlist, L_list, gamma_list, method)


def dephasing(rho0, tlist, T2, method='expm'):
    H = np.zeros((2, 2), dtype=complex)
    sx, sy, sz = pauli_matrices()
    L_list = [sz]
    gamma_list = [1.0 / (2 * T2)]
    return lindblad_solve(H, rho0, tlist, L_list, gamma_list, method)


def amplitude_damping_dephasing(rho0, tlist, T1, T2, method='expm'):
    H = np.zeros((2, 2), dtype=complex)
    sm, sp = spin_operators()
    sx, sy, sz = pauli_matrices()
    gamma_d = 1.0 / T2 - 1.0 / (2 * T1)
    if gamma_d < 0:
        raise ValueError(f"T2={T2} cannot be less than 2*T1={2*T1}")
    L_list = [sm, sz]
    gamma_list = [1.0 / T1, gamma_d / 2]
    return lindblad_solve(H, rho0, tlist, L_list, gamma_list, method)


def thermal_relaxation(rho0, tlist, T1, T2, temperature=0.0, method='expm'):
    """Temperature-dependent relaxation with excitation rate."""
    H = np.zeros((2, 2), dtype=complex)
    sm, sp = spin_operators()
    sx, sy, sz = pauli_matrices()

    n_th = 1.0 / (np.exp(1.0 / temperature) - 1) if temperature > 0 else 0.0
    gamma_down = (1.0 / T1) * (n_th + 1)
    gamma_up = (1.0 / T1) * n_th
    gamma_d = 1.0 / T2 - 1.0 / (2 * T1)

    L_list = [sm, sp, sz]
    gamma_list = [gamma_down, gamma_up, gamma_d / 2]
    return lindblad_solve(H, rho0, tlist, L_list, gamma_list, method)


def t1_expected_decay(rho0, t, T1):
    r0 = bloch_vector(rho0)
    z0 = r0[2]
    return 1 - (1 - z0) * np.exp(-t / T1)


def t2_expected_decay(rho0, t, T2):
    r0 = bloch_vector(rho0)
    x0, y0 = r0[0], r0[1]
    return x0 * np.exp(-t / T2), y0 * np.exp(-t / T2)
