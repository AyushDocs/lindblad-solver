import numpy as np
from scipy.linalg import expm
from scipy.integrate import solve_ivp


def lindblad_superoperator(H, L_list=None, gamma_list=None):
    n = H.shape[0]
    I = np.eye(n)

    L = -1j * (np.kron(I, H) - np.kron(H.T, I))

    if L_list is not None:
        if gamma_list is None:
            gamma_list = [1.0] * len(L_list)
        for Lk, gk in zip(L_list, gamma_list):
            term1 = np.kron(Lk.conj(), Lk)
            Lk_dag_Lk = Lk.conj().T @ Lk
            term2 = -0.5 * np.kron(I, Lk_dag_Lk)
            term3 = -0.5 * np.kron(Lk_dag_Lk.T, I)
            L += gk * (term1 + term2 + term3)

    return L


def lindblad_solve(H, rho0, tlist, L_list=None, gamma_list=None, method='expm'):
    n = H.shape[0]
    L_op = lindblad_superoperator(H, L_list, gamma_list)
    rho0_vec = rho0.reshape(-1, order='F')

    if method == 'expm':
        rhos = []
        for t in tlist:
            rho_t_vec = expm(L_op * t) @ rho0_vec
            rho_t = rho_t_vec.reshape(n, n, order='F')
            rhos.append(rho_t)
        return np.array(rhos)

    elif method == 'ode':
        def drho_dt(t, rho_vec):
            return L_op @ rho_vec

        sol = solve_ivp(drho_dt, [tlist[0], tlist[-1]], rho0_vec,
                        t_eval=tlist, method='DOP853', rtol=1e-12, atol=1e-14)
        rhos = np.array([v.reshape(n, n, order='F') for v in sol.y.T])
        return rhos

    else:
        raise ValueError(f"Unknown method: {method}")


def steady_state(H, L_list=None, gamma_list=None):
    L_op = lindblad_superoperator(H, L_list, gamma_list)
    n = H.shape[0]

    u, s, vh = np.linalg.svd(L_op)
    rho_ss_vec = vh[-1, :].conj()

    rho_ss = rho_ss_vec.reshape(n, n, order='F')
    rho_ss = rho_ss / np.trace(rho_ss)
    rho_ss = (rho_ss + rho_ss.conj().T) / 2

    return rho_ss


def bloch_vector(rho):
    sx = np.array([[0, 1], [1, 0]], dtype=complex)
    sy = np.array([[0, -1j], [1j, 0]], dtype=complex)
    sz = np.array([[1, 0], [0, -1]], dtype=complex)
    x = np.trace(rho @ sx).real
    y = np.trace(rho @ sy).real
    z = np.trace(rho @ sz).real
    return np.array([x, y, z])


def pauli_matrices():
    sx = np.array([[0, 1], [1, 0]], dtype=complex)
    sy = np.array([[0, -1j], [1j, 0]], dtype=complex)
    sz = np.array([[1, 0], [0, -1]], dtype=complex)
    return sx, sy, sz


def spin_operators():
    """σ_- = |g⟩⟨e| (lowering/ladder-down), σ_+ = |e⟩⟨g| (raising/ladder-up)."""
    sm = np.array([[0, 1], [0, 0]], dtype=complex)
    sp = np.array([[0, 0], [1, 0]], dtype=complex)
    return sm, sp
