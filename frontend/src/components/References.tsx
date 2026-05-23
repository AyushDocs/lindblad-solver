"use client";

import { motion } from "framer-motion";

export default function References() {
  return (
    <section id="references" className="py-24 px-4 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">
              References &amp; Resources
            </span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Dive deeper into the theory and code behind this project.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <motion.a
            href="https://github.com/AyushDocs/lindblad-solver"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-2xl p-6 border border-border/50 block hover:border-rose-500/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <h3 className="text-lg font-semibold">GitHub Repository</h3>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Full source code: Lindblad superoperator builder, ODE solver, steady state
              via SVD, Bloch sphere visualization, and all demo scripts.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-rose-400">
              <span>AyushDocs/lindblad-solver</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </motion.a>

          <motion.a
            href="https://lindblad-solver.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-2xl p-6 border border-border/50 block hover:border-rose-500/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 0c1.657 0 3 4.03 3 9s-1.343 9-3 9" />
              </svg>
              <h3 className="text-lg font-semibold">Live Gallery (Vercel)</h3>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Pre-computed figures from all demo scenarios, served via FastAPI on
              Vercel&apos;s serverless edge. Includes base64-embedded plots from the
              full parameter sweep.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-rose-400">
              <span>lindblad-solver.vercel.app</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </motion.a>
        </div>

        <motion.div
          className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Key Source Files</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { file: "solver.py", desc: "Core Lindblad superoperator, time evolution (expm/ODE), steady state via SVD, Bloch vector utilities." },
              { file: "channels.py", desc: "T<sub>1</sub> amplitude damping, T<sub>2</sub> dephasing, combined T<sub>1</sub>+T<sub>2</sub>, and thermal relaxation with excitation rates." },
              { file: "driven_tls.py", desc: "Resonant/off-resonant drive, analytical steady state, and comparison against numerical solutions." },
              { file: "visualization.py", desc: "3D Bloch sphere, trajectory plots, population vs time, coherence vs time, and figure layout helpers." },
              { file: "main.py", desc: "Demo runner: orchestrates all scenarios and saves publication-quality PNG figures." },
              { file: "api/index.py", desc: "FastAPI + Mangum serverless adapter serving the gallery as base64-embedded HTML." },
            ].map((f) => (
              <a
                key={f.file}
                href={`https://github.com/AyushDocs/lindblad-solver/blob/main/${f.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/50 rounded-xl p-4 border border-border/50 hover:border-rose-500/50 transition-colors group"
              >
                <div className="font-mono text-xs text-rose-400 mb-2 group-hover:underline">
                  {f.file}
                </div>
                <p className="text-muted text-xs leading-relaxed">{f.desc}</p>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
