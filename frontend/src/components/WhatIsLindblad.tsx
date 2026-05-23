"use client";

import { motion } from "framer-motion";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function WhatIsLindblad() {
  return (
    <section id="what-is" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">
              What is the Lindblad Equation?
            </span>
          </h2>
          <p className="text-muted text-center max-w-2xl mx-auto mb-16 text-lg">
            Real quantum systems don't live in isolation — they interact with their environment.
            The Lindblad equation is the tool we use to model this.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <FadeIn delay={0.1}>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 h-full">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">The Problem</h3>
              <p className="text-muted leading-relaxed">
                The Schrödinger equation describes closed quantum systems perfectly. But
                in the real world, qubits in a quantum computer, atoms in a trap, or
                electrons in a semiconductor are constantly interacting with their
                environment. This causes <strong className="text-foreground">decoherence</strong> and{" "}
                <strong className="text-foreground">dissipation</strong> — the quantum
                information leaks out.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 h-full">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">The Solution</h3>
              <p className="text-muted leading-relaxed">
                The Lindblad master equation extends the Schrödinger equation to
                describe <strong className="text-foreground">open quantum systems</strong>.
                It adds non-unitary terms (Lindblad operators) that model how the
                environment causes population decay, dephasing, and other noise
                processes — while keeping the density matrix physically valid.
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 mb-16">
            <h3 className="text-xl font-semibold mb-6 text-center">
              The Equation — Broken Down
            </h3>
            <div className="flex justify-center mb-8">
              <div className="bg-background rounded-xl p-6 sm:p-8 border border-border/50 overflow-x-auto w-full max-w-3xl">
                <div className="text-sm sm:text-base text-rose-400 font-mono leading-relaxed text-center whitespace-pre-wrap break-all">
                  dρ/dt = -i[H, ρ] + Σ<sub>j</sub> γ<sub>j</sub>(L<sub>j</sub> ρ L<sub>j</sub>† - &frac12;&#123;L<sub>j</sub>†L<sub>j</sub>, ρ&#125;)
                </div>
              </div>
            </div>

            <div className="space-y-6 text-sm text-muted leading-relaxed">
              <div className="bg-background/50 rounded-xl p-5 border border-border/50">
                <h4 className="text-foreground font-semibold mb-2">First, what is ρ?</h4>
                <p>
                  In closed quantum systems we use state vectors |ψ⟩. But when noise is
                  involved, the system is in a <strong className="text-foreground">statistical mixture</strong> of
                  states. The <strong className="text-foreground">density matrix</strong> ρ captures both quantum
                  superposition and classical uncertainty. Its diagonal entries are
                  <strong className="text-foreground"> populations</strong> (probability of being in each basis state)
                  and its off-diagonals are <strong className="text-foreground">coherences</strong> (quantum phase
                  relationships). A valid ρ must be Hermitian, have trace = 1, and be
                  positive semi-definite — the Lindblad equation preserves all three.
                </p>
              </div>

              <div className="bg-background/50 rounded-xl p-5 border border-border/50">
                <h4 className="text-foreground font-semibold mb-2">Term 1: -i[H, ρ] — Unitary Evolution</h4>
                <p>
                  This is the <strong className="text-foreground">von Neumann equation</strong>, the density-matrix
                  equivalent of the Schrödinger equation. The commutator [H, ρ] = Hρ − ρH
                  generates reversible, unitary time evolution under the system Hamiltonian
                  H. If no noise channels are present (all γ<sub>j</sub> = 0), this term alone
                  governs the dynamics and the evolution is perfectly coherent — exactly
                  like solving the Schrödinger equation.
                </p>
              </div>

              <div className="bg-background/50 rounded-xl p-5 border border-border/50">
                <h4 className="text-foreground font-semibold mb-2">Term 2: Σ<sub>j</sub> γ<sub>j</sub>(L<sub>j</sub> ρ L<sub>j</sub>† - &frac12;&#123;L<sub>j</sub>†L<sub>j</sub>, ρ&#125;) — The Dissipator</h4>
                <p>
                  This is the <strong className="text-foreground">Lindblad dissipator</strong> that adds non-unitary,
                  irreversible dynamics. It has two parts:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold mt-0.5">1.</span>
                    <span><strong className="text-foreground">"Jump" term L<sub>j</sub> ρ L<sub>j</sub>†</strong> — represents
                    quantum jumps: the system suddenly transitions because it exchanged
                    energy or information with the environment (e.g., emitting a photon).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold mt-0.5">2.</span>
                    <span><strong className="text-foreground">"Recoil" term -&frac12;&#123;L<sub>j</sub>†L<sub>j</sub>, ρ&#125;</strong> — the
                    anti-commutator &#123;A, B&#125; = AB + BA ensures the density matrix stays
                    normalized (trace = 1) by removing population from the state that
                    just jumped away. Together, the two terms keep the dynamics
                    <strong className="text-foreground"> trace-preserving</strong> and
                    <strong className="text-foreground"> completely positive</strong>.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background/50 rounded-xl p-5 border border-border/50">
                <h4 className="text-foreground font-semibold mb-2">What are L<sub>j</sub> and γ<sub>j</sub>?</h4>
                <p>
                  Each <strong className="text-foreground">Lindblad operator L<sub>j</sub></strong> describes a specific
                  noise channel — an operator that couples the system to a particular
                  environmental degree of freedom. For example:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong className="text-foreground font-mono">L = σ<sub>-</sub></strong> (lowering operator) models T<sub>1</sub> energy relaxation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong className="text-foreground font-mono">L = σ<sub>z</sub></strong> (Pauli-Z) models T<sub>2</sub> pure dephasing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong className="text-foreground font-mono">L = σ<sub>+</sub></strong> (raising operator) models thermal excitation</span>
                  </li>
                </ul>
                <p className="mt-3">
                  The <strong className="text-foreground">rate γ<sub>j</sub></strong> controls how strongly the system
                  couples to that noise channel. Physically, γ = 1/T for exponential
                  decay processes. Larger γ means faster decoherence. You can include
                  multiple channels simultaneously — just sum over all of them.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 mb-16">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Why This Form?
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted">
              <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                <h4 className="text-foreground font-semibold mb-1">Trace-Preserving</h4>
                <p>The dissipator is designed so tr(dρ/dt) = 0 always. This guarantees probabilities stay normalized — tr(ρ) = 1 at all times.</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                <h4 className="text-foreground font-semibold mb-1">Completely Positive</h4>
                <p>The Lindblad form is the most general generator that ensures ρ stays positive semi-definite, even when the system is entangled with an environment.</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                <h4 className="text-foreground font-semibold mb-1">Markovian</h4>
                <p>The equation assumes the environment has no memory — it&apos;s a <strong className="text-foreground">Markovian</strong> approximation. Valid when the environment correlation time is much shorter than the system dynamics.</p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50">
            <h3 className="text-xl font-semibold mb-4">Why This Matters</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Quantum Computing",
                  desc: "Qubits decohere over T<sub>1</sub> and T<sub>2</sub> timescales. Lindblad models predict error rates, guide error correction design, and simulate noisy intermediate-scale quantum (NISQ) devices.",
                },
                {
                  title: "Quantum Optics",
                  desc: "Atoms in cavities spontaneously emit photons, lasers have finite linewidths, and optical coherence decays — all captured naturally by Lindblad operators acting on the electromagnetic field modes.",
                },
                {
                  title: "Quantum Biology",
                  desc: "Photosynthetic light-harvesting complexes, avian magnetoreception, and enzymatic reactions all involve open quantum dynamics where the environment plays a functional, not just destructive, role.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-background/50 rounded-xl p-4 border border-border/50">
                  <h4 className="text-foreground font-semibold mb-2">{item.title}</h4>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
