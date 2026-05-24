"use client";

import { motion } from "framer-motion";
import QuantumSimulator from "./QuantumSimulator";

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

export default function Simulation() {
  return (
    <section id="simulation" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">
              Interactive Simulation
            </span>
          </h2>
          <p className="text-muted text-center max-w-2xl mx-auto mb-16 text-lg">
            Run the solver yourself locally in Jupyter Notebooks.
          </p>
        </FadeIn>

        <div className="max-w-2xl mx-auto mb-16">
          <FadeIn delay={0.1}>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Run in Jupyter</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Clone the repo and run the notebooks. The solver includes detailed documentation
                and visual plots within the Jupyter environment.
              </p>
              <div className="bg-background rounded-xl p-4 border border-border/50">
                <pre className="text-xs text-rose-400 font-mono overflow-x-auto whitespace-pre-wrap break-all">
{`git clone https://github.com/AyushDocs/lindblad-solver.git
cd lindblad-solver
pip install -r requirements-dev.txt
jupyter notebook`}
                </pre>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <QuantumSimulator />
        </FadeIn>
      </div>
    </section>
  );
}
