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
            Run the solver yourself — either locally or on the cloud via our API.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <FadeIn delay={0.1}>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 h-full">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Run with Python</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Clone the repo and run the demonstrations. The solver is pure NumPy/SciPy
                — no quantum SDK required.
              </p>
              <div className="bg-background rounded-xl p-4 border border-border/50">
                <pre className="text-xs text-rose-400 font-mono overflow-x-auto whitespace-pre-wrap break-all">
{`git clone https://github.com/AyushDocs/lindblad-solver.git
cd lindblad-solver
pip install -r requirements.txt
python main.py`}
                </pre>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 h-full">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 0c1.657 0 3 4.03 3 9s-1.343 9-3 9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Live API (Vercel)</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                The solver is also deployed as a FastAPI endpoint. Browse the gallery
                of pre-computed figures online.
              </p>
              <div className="bg-background rounded-xl p-4 border border-border/50">
                <pre className="text-xs text-rose-400 font-mono overflow-x-auto whitespace-pre-wrap break-all">
{`# API is live at:
https://lindblad-solver.vercel.app/

# Health check:
GET /api/health`}
                </pre>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Try It Yourself — Parameter Explorer
            </h3>
            <p className="text-muted text-center max-w-xl mx-auto mb-8 text-sm">
              Modify the parameters and imagine what the Bloch sphere trajectory would look like.
              Then run <strong className="text-foreground font-mono">python main.py</strong> to see the real result.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Drive (Ω)", values: ["0.5 (weak)", "2.0 (moderate)", "10.0 (strong)"], note: "Controls Rabi frequency" },
                { label: "Detuning (Δ)", values: ["0 (resonant)", "1.0 (near)", "3.0 (far)"], note: "How far drive is from resonance" },
                { label: "Damping (γ)", values: ["0.1 (weak)", "1.0 (moderate)", "5.0 (strong)"], note: "Coupling to environment" },
              ].map((param) => (
                <div key={param.label} className="bg-background/50 rounded-xl p-4 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">{param.label}</h4>
                  <ul className="space-y-1 mb-3">
                    {param.values.map((v) => (
                      <li key={v} className="text-xs text-muted flex items-center gap-1">
                        <span className="text-rose-400">•</span> {v}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted italic">{param.note}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
