import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch
from mpl_toolkits.mplot3d import proj3d


class Arrow3D(FancyArrowPatch):
    def __init__(self, xs, ys, zs, *args, **kwargs):
        super().__init__((0, 0), (0, 0), *args, **kwargs)
        self._verts3d = xs, ys, zs

    def do_3d_projection(self):
        xs, ys, zs = self._verts3d
        xs, ys, zs = proj3d.proj_transform(xs, ys, zs, self.axes.M)
        self.set_positions((xs[0], ys[0]), (xs[1], ys[1]))
        return np.min(zs)


def plot_bloch_sphere(ax=None, title=None):
    if ax is None:
        fig = plt.figure(figsize=(8, 8))
        ax = fig.add_subplot(111, projection='3d')

    ax.set_xlim(-1.3, 1.3)
    ax.set_ylim(-1.3, 1.3)
    ax.set_zlim(-1.3, 1.3)

    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')

    u = np.linspace(0, 2 * np.pi, 50)
    v = np.linspace(0, np.pi, 50)
    x = np.outer(np.cos(u), np.sin(v))
    y = np.outer(np.sin(u), np.sin(v))
    z = np.outer(np.ones(np.size(u)), np.cos(v))

    ax.plot_wireframe(x, y, z, color='gray', alpha=0.15, rstride=4, cstride=4)

    for axis, color, label in [(np.array([1, 0, 0]), 'r', '|+⟩'),
                                (np.array([0, 1, 0]), 'g', '|+i⟩'),
                                (np.array([0, 0, 1]), 'b', '|0⟩')]:
        ax.plot([-axis[0], axis[0]], [-axis[1], axis[1]], [-axis[2], axis[2]],
                color=color, alpha=0.6, linewidth=1)

    for axis, color, neg_label, pos_label in [
        (np.array([1, 0, 0]), 'r', '|−⟩', '|+⟩'),
        (np.array([0, 1, 0]), 'g', '|−i⟩', '|+i⟩'),
        (np.array([0, 0, 1]), 'b', '|1⟩', '|0⟩'),
    ]:
        ax.text(-axis[0] * 1.15, -axis[1] * 1.15, -axis[2] * 1.15,
                neg_label, color=color, ha='center', fontsize=10)
        ax.text(axis[0] * 1.15, axis[1] * 1.15, axis[2] * 1.15,
                pos_label, color=color, ha='center', fontsize=10)

    ax.set_axis_off()
    if title:
        ax.set_title(title, fontsize=14)

    return ax


def plot_trajectory(bloch_vectors, ax=None, color='blue', label=None,
                    show_initial=True, show_final=True):
    if ax is None:
        fig = plt.figure(figsize=(8, 8))
        ax = fig.add_subplot(111, projection='3d')
        plot_bloch_sphere(ax)

    bv = np.array(bloch_vectors)
    ax.plot(bv[:, 0], bv[:, 1], bv[:, 2], color=color, alpha=0.8, linewidth=2, label=label)

    if show_initial and len(bv) > 0:
        ax.scatter([bv[0, 0]], [bv[0, 1]], [bv[0, 2]],
                   color=color, s=80, marker='o', alpha=0.7)

    if show_final and len(bv) > 0:
        ax.scatter([bv[-1, 0]], [bv[-1, 1]], [bv[-1, 2]],
                   color=color, s=120, marker='*', alpha=1.0)

    if label:
        ax.legend(loc='upper left')

    return ax


def plot_population_vs_time(tlist, rhos, labels=None, colors=None, ax=None):
    if ax is None:
        fig, ax = plt.subplots(figsize=(10, 6))

    pops = np.array([np.diag(r).real for r in rhos])
    n = pops.shape[1]

    if labels is None:
        labels = [f'|{i}⟩' for i in range(n)]
    if colors is None:
        colors = plt.cm.viridis(np.linspace(0, 0.9, n))

    for i in range(n):
        ax.plot(tlist, pops[:, i], color=colors[i], linewidth=2, label=labels[i])

    ax.set_xlabel('Time', fontsize=12)
    ax.set_ylabel('Population', fontsize=12)
    ax.set_ylim(-0.05, 1.05)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)

    return ax


def plot_coherence_vs_time(tlist, rhos, ax=None):
    if ax is None:
        fig, ax = plt.subplots(figsize=(10, 6))

    cohs = np.array([np.abs(r[0, 1]) for r in rhos])
    ax.plot(tlist, cohs, color='purple', linewidth=2, label='|ρ₀₁|')

    ax.set_xlabel('Time', fontsize=12)
    ax.set_ylabel('Coherence magnitude', fontsize=12)
    ax.set_ylim(-0.05, 1.05)
    ax.legend(fontsize=11)
    ax.grid(True, alpha=0.3)

    return ax


def setup_figure(rows=1, cols=1, figsize=None):
    if figsize is None:
        figsize = (cols * 8, rows * 6)
    fig, axes = plt.subplots(rows, cols, figsize=figsize)
    if rows == 1 and cols == 1:
        axes = np.array([[axes]])
    elif rows == 1 or cols == 1:
        axes = axes.reshape(rows, cols)
    return fig, axes
