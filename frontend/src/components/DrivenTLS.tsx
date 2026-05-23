"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

export default function DrivenTLS() {
  return (
    <section id="driven" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">
              Driven Two-Level System
            </span>
          </h2>
          <p className="text-muted text-center max-w-2xl mx-auto mb-16 text-lg">
            What happens when we drive a qubit with a laser or microwave pulse while
            it&apos;s also coupled to a noisy environment?
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 mb-20 items-center">
          <FadeIn>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 h-full">
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-4">
                Resonant Drive
              </div>
              <h3 className="text-2xl font-semibold mb-4">Damped Rabi Oscillations</h3>
              <p className="text-muted leading-relaxed mb-4">
                When a drive (Ω) is resonant with the qubit transition, the population
                oscillates between |0⟩ and |1⟩ — but damping (γ) from the environment
                causes these Rabi oscillations to decay until a steady state is reached.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>Hamiltonian: <strong className="text-foreground font-mono">H = (Ω/2) σ_x</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>Oscillations damp at rate <strong className="text-foreground">γ</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span>Steady state is a mixed state (not full inversion)</span>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/50 bg-card">
              <Image
                src="/figures/fig_driven_tls.png"
                alt="Driven TLS resonant plot"
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 mb-16">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Bloch Sphere Trajectories
            </h3>
            <p className="text-muted text-center max-w-2xl mx-auto mb-8">
              Watch how the state evolves on the Bloch sphere — the standard way to
              visualize a qubit&apos;s state. Resonant drives spiral to the equator,
              while off-resonant drives trace smaller loops.
            </p>
            <div className="space-y-6">
              <div>
                <div className="relative aspect-[4/3] sm:aspect-[16/7] rounded-xl overflow-hidden border border-border/50 bg-card">
                  <Image
                    src="/figures/fig_driven_tls_bloch.png"
                    alt="Resonant and off-resonant Bloch trajectories"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
                <p className="text-xs text-muted mt-2">
                  Bloch sphere: resonant drive (orange) vs off-resonant drive (purple)
                </p>
              </div>
              <div>
                <div className="relative aspect-[4/3] sm:aspect-[16/7] rounded-xl overflow-hidden border border-border/50 bg-card">
                  <Image
                    src="/figures/fig_t1_bloch.png"
                    alt="T1 Bloch trajectory"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
                <p className="text-xs text-muted mt-2">
                  Pure T<sub>1</sub> decay — Bloch vector spirals from the excited state to the ground state
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4">
                <span className="text-rose-400 font-bold text-lg">Ω</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Resonant Drive</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                When Δ = 0 (drive frequency = qubit frequency), the drive efficiently
                excites the qubit. The Bloch vector spirals from the north pole toward
                the equator, with damped oscillations.
              </p>
              <div className="bg-background rounded-lg p-3 border border-border/50">
                <div className="text-xs text-rose-400 font-mono">Steady state: z<sub>ss</sub> = γ<sup>2</sup> / (γ<sup>2</sup> + 2Ω<sup>2</sup>)</div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <span className="text-red-400 font-bold text-lg">Δ</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Off-Resonant Drive</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                When Δ ≠ 0 (drive is detuned), the qubit never fully inverts. The
                Bloch vector traces a smaller path and the steady state has less
                excited population — the qubit&apos;s response is suppressed.
              </p>
              <div className="bg-background rounded-lg p-3 border border-border/50">
                <div className="text-xs text-rose-400 font-mono">Steady state: z<sub>ss</sub> = (γ<sup>2</sup> + 4Δ<sup>2</sup>) / (γ<sup>2</sup> + 2Ω<sup>2</sup> + 4Δ<sup>2</sup>)</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
