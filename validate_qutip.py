import numpy as np

from solver import (
    lindblad_superoperator, lindblad_solve, steady_state,
    bloch_vector, pauli_matrices, spin_operators
)
from channels import amplitude_damping, dephasing
from driven_tls import resonant_drive, analytical_steady_state_driven


def validate_superoperator():
    print("=" * 60)
    print("1. Validating Lindblad superoperator against QuTiP")
    print("=" * 60)

    try:
        import qutip as qt
    except ImportError:
        print("  QuTiP not installed — skipping validation.")
        return None, None, None

    sx, sy, sz = pauli_matrices()
    sm, sp = spin_operators()

    H = 0.5 * sx
    gamma = 1.0

    L_manual = lindblad_superoperator(H, [sm], [gamma])

    H_qt = qt.Qobj(H)
    sm_qt = qt.Qobj(sm)
    L_qt = qt.liouvillian(H_qt, [np.sqrt(gamma) * sm_qt]).full()

    diff = np.max(np.abs(L_manual - L_qt))
    print(f"  Superoperator max difference: {diff:.2e}")
    assert diff < 1e-10, f"Superoperator mismatch: {diff}"
    print("  ✓ Superoperator matches QuTiP")
    return L_manual, L_qt, diff


def validate_time_evolution():
    print("\n" + "=" * 60)
    print("2. Validating time evolution against QuTiP")
    print("=" * 60)

    try:
        import qutip as qt
    except ImportError:
        print("  QuTiP not installed — skipping validation.")
        return

    sx, sy, sz = pauli_matrices()
    sm, sp = spin_operators()

    T1 = 10.0
    rho0 = np.array([[0.5, 0.5j], [-0.5j, 0.5]], dtype=complex)
    tlist = np.linspace(0, 5 * T1, 100)

    rhos_manual = amplitude_damping(rho0, tlist, T1, method='expm')

    H_qt = qt.Qobj(np.zeros((2, 2), dtype=complex))
    sm_qt = qt.Qobj(sm)
    rho0_qt = qt.Qobj(rho0)
    c_ops = [np.sqrt(1.0 / T1) * sm_qt]
    result_qt = qt.mesolve(H_qt, rho0_qt, tlist, c_ops, [])

    diffs = []
    for i, t in enumerate(tlist):
        rho_m = rhos_manual[i]
        rho_q = result_qt.states[i].full()
        diff = np.max(np.abs(rho_m - rho_q))
        diffs.append(diff)

    max_diff = max(diffs)
    print(f"  Max difference in time evolution: {max_diff:.2e}")
    assert max_diff < 1e-10, f"Time evolution mismatch: {max_diff}"
    print("  ✓ Time evolution matches QuTiP")


def validate_steady_state():
    print("\n" + "=" * 60)
    print("3. Validating steady state against analytical result")
    print("=" * 60)

    Omega = 2.0
    gamma = 1.0

    rho_ss_num = steady_state(
        0.5 * Omega * pauli_matrices()[0],
        [spin_operators()[0]], [gamma]
    )
    rho_ss_ana = analytical_steady_state_driven(Omega, gamma)

    r_num = bloch_vector(rho_ss_num)
    r_ana = bloch_vector(rho_ss_ana)

    print(f"  Numerical:   r = ({r_num[0]:.6f}, {r_num[1]:.6f}, {r_num[2]:.6f})")
    print(f"  Analytical:  r = ({r_ana[0]:.6f}, {r_ana[1]:.6f}, {r_ana[2]:.6f})")

    diff = np.max(np.abs(r_num - r_ana))
    print(f"  Bloch vector difference: {diff:.2e}")
    assert diff < 1e-10, f"Steady state mismatch: {diff}"
    print("  ✓ Steady state matches analytical result")


def main():
    print("Validating Lindblad Solver\n")
    validate_superoperator()
    validate_time_evolution()
    validate_steady_state()
    print("\n" + "=" * 60)
    print("All validations passed!")
    print("=" * 60)


if __name__ == '__main__':
    main()
