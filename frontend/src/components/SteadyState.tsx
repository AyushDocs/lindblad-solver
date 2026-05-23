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

export default function SteadyState() {
  return (
    <section id="steady-state" className="py-24 px-4 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">
              Steady State Analysis
            </span>
          </h2>
          <p className="text-muted text-center max-w-2xl mx-auto mb-16 text-lg">
            After all transients decay, what state does the system settle into?
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
          <FadeIn>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 h-full">
              <h3 className="text-xl font-semibold mb-4">Steady State vs Drive Strength</h3>
              <p className="text-muted leading-relaxed mb-4">
                As the drive strength Ω increases, the steady state shifts. The
                analytical solution (lines) and numerical solver (markers) agree to
                machine precision — validating the implementation.
              </p>
              <div className="space-y-3 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span>⟨X⟩ — coherence (real part)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span>⟨Y⟩ — coherence (imaginary part)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>⟨Z⟩ — population inversion</span>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/50 bg-card">
              <Image
                src="/figures/fig_steady_state_sweep.png"
                alt="Steady state vs drive strength"
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50">
            <h3 className="text-xl font-semibold mb-4 text-center">How the Solver Works</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-background/50 rounded-xl p-4 border border-border/50 text-center">
                <div className="text-2xl font-bold text-rose-400 mb-1">1</div>
                <h4 className="font-semibold text-foreground mb-1">Build Superoperator</h4>
                <p className="text-muted">The Lindblad terms are assembled into a single linear operator L acting on the vectorized density matrix.</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-border/50 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">2</div>
                <h4 className="font-semibold text-foreground mb-1">Evolve or Solve</h4>
                <p className="text-muted">Two methods: matrix exponentiation for uniform time steps, or adaptive ODE integration for stiff systems.</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 border border-border/50 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">3</div>
                <h4 className="font-semibold text-foreground mb-1">Steady State via SVD</h4>
                <p className="text-muted">The null space of the superoperator gives the steady state. SVD finds the eigenvector with zero eigenvalue.</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
