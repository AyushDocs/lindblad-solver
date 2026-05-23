"use client";

import { motion } from "framer-motion";
import Image from "next/image";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function NoiseChannels() {
  return (
    <section id="noise" className="py-24 px-4 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">
              Noise Channels: T<sub>1</sub> &amp; T<sub>2</sub>
            </span>
          </h2>
          <p className="text-muted text-center max-w-2xl mx-auto mb-16 text-lg">
            The two most important decoherence timescales in any quantum system.
          </p>
        </FadeIn>

        {/* T1 Section */}
        <div className="mb-20">
          <FadeIn>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 mb-6">
              <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono mb-4">
                T₁ Amplitude Damping
              </div>
              <h3 className="text-2xl font-semibold mb-4">Energy Relaxation</h3>
              <p className="text-muted leading-relaxed mb-4">
                T<sub>1</sub> describes how an excited state |1⟩ relaxes to the ground state |0⟩ by
                emitting energy to the environment — like a photon escaping a cavity or
                a phonon carrying heat away.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">→</span>
                  <span>Population of |1⟩ decays as <strong className="text-foreground">exp(-t/T<sub>1</sub>)</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">→</span>
                  <span>Both diagonal (populations) and off-diagonal (coherence) are affected</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">→</span>
                  <span>Lindblad operator: <strong className="text-foreground font-mono">σ<sub>-</sub> = |g⟩⟨e|</strong></span>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/3] sm:aspect-[16/7] rounded-2xl overflow-hidden border border-border/50 bg-card">
              <Image
                src="/figures/fig_t1_decay.png"
                alt="T1 amplitude decay plot"
                fill
                className="object-contain p-2"
                sizes="(max-width: 1024px) 100vw, 1024px"
                loading="eager"
              />
            </div>
          </FadeIn>
        </div>

        {/* T2 Section */}
        <div className="mb-20">
          <FadeIn>
            <div className="relative aspect-[4/3] sm:aspect-[16/7] rounded-2xl overflow-hidden border border-border/50 bg-card mb-6">
              <Image
                src="/figures/fig_t2_dephasing.png"
                alt="T2 dephasing plot"
                fill
                className="object-contain p-2"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50">
              <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono mb-4">
                T<sub>2</sub> Dephasing
              </div>
              <h3 className="text-2xl font-semibold mb-4">Phase Damping</h3>
              <p className="text-muted leading-relaxed mb-4">
                T<sub>2</sub> describes how quantum phase information is lost without energy
                leaving the system. Random fluctuations in the environment cause
                the relative phase between |0⟩ and |1⟩ to drift randomly.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Populations stay constant — only coherences decay</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Off-diagonal elements decay as <strong className="text-foreground">exp(-t/T<sub>2</sub>)</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Lindblad operator: <strong className="text-foreground font-mono">σ_z</strong></span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>

        {/* Combined */}
        <FadeIn>
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-4">
              Combined T<sub>1</sub> + T<sub>2</sub>
            </div>
            <h3 className="text-2xl font-semibold mb-4">When Both Channels Act Together</h3>
            <p className="text-muted leading-relaxed mb-6 max-w-3xl">
              Real qubits experience both T<sub>1</sub> and T<sub>2</sub> simultaneously. The Bloch vector
              spirals inwards as energy decays and phase coherence is lost. Typically,
              T<sub>2</sub> ≤ 2T<sub>1</sub> — dephasing always acts at least as fast as energy relaxation.
            </p>
            <div className="space-y-6">
              <div>
                <div className="relative aspect-[4/3] sm:aspect-[16/7] rounded-xl overflow-hidden border border-border/50 bg-card">
                  <Image
                    src="/figures/fig_combined_t1_t2.png"
                    alt="Combined T1+T2 plot"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
                <p className="text-xs text-muted mt-2">
                  Populations &amp; coherence over time under combined T<sub>1</sub> + T<sub>2</sub>
                </p>
              </div>
              <div>
                <div className="relative aspect-[4/3] sm:aspect-[16/7] rounded-xl overflow-hidden border border-border/50 bg-card">
                  <Image
                    src="/figures/fig_all_channels.png"
                    alt="All noise channels on Bloch sphere"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
                <p className="text-xs text-muted mt-2">
                  Bloch sphere trajectories for amplitude damping (blue), dephasing (green), and combined (red)
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
