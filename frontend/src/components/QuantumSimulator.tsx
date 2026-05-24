"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Point3D {
  x: number;
  y: number;
  z: number;
  t: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  depth: number;
}

export default function QuantumSimulator() {
  // Hamiltonian and Lindblad parameters
  const [omega, setOmega] = useState(1.5); // Rabi frequency
  const [detuning, setDetuning] = useState(0.0); // Detuning Delta
  const [gamma, setGamma] = useState(0.2); // T1 decay rate
  const [gammaPhi, setGammaPhi] = useState(0.05); // T2 dephasing rate
  
  // Simulation controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [initialStateName, setInitialStateName] = useState<"excited" | "ground" | "superposition">("excited");
  
  // 3D Rotation angles (in degrees)
  const [yaw, setYaw] = useState(45);
  const [pitch, setPitch] = useState(20);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const angleStart = useRef({ yaw: 45, pitch: 20 });

  // Simulation state
  const [state, setState] = useState({ x: 0, y: 0, z: 1 });
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState<Point3D[]>([]);

  // Simulation ref for animation loop (avoids stale closures)
  const simRef = useRef({
    x: 0,
    y: 0,
    z: 1,
    t: 0,
    history: [] as Point3D[],
    omega: 1.5,
    detuning: 0.0,
    gamma: 0.2,
    gammaPhi: 0.05,
  });

  // Keep ref in sync with React state
  useEffect(() => {
    simRef.current.omega = omega;
    simRef.current.detuning = detuning;
    simRef.current.gamma = gamma;
    simRef.current.gammaPhi = gammaPhi;
  }, [omega, detuning, gamma, gammaPhi]);

  // Set initial state
  const resetToState = (stateType: "excited" | "ground" | "superposition") => {
    let x = 0, y = 0, z = 1;
    if (stateType === "ground") {
      x = 0; y = 0; z = -1;
    } else if (stateType === "superposition") {
      x = 1; y = 0; z = 0;
    }
    
    simRef.current.x = x;
    simRef.current.y = y;
    simRef.current.z = z;
    simRef.current.t = 0;
    simRef.current.history = [{ x, y, z, t: 0 }];
    
    setState({ x, y, z });
    setTime(0);
    setHistory([{ x, y, z, t: 0 }]);
    setInitialStateName(stateType);
  };

  // Preset Configurations
  const applyPreset = (preset: "rabi" | "t1" | "t2" | "steady") => {
    if (preset === "rabi") {
      setOmega(2.5);
      setDetuning(0.0);
      setGamma(0.0);
      setGammaPhi(0.0);
      resetToState("excited");
    } else if (preset === "t1") {
      setOmega(0.0);
      setDetuning(0.0);
      setGamma(0.6);
      setGammaPhi(0.0);
      resetToState("excited");
    } else if (preset === "t2") {
      setOmega(0.0);
      setDetuning(0.0);
      setGamma(0.0);
      setGammaPhi(0.6);
      resetToState("superposition");
    } else if (preset === "steady") {
      setOmega(1.8);
      setDetuning(0.5);
      setGamma(0.4);
      setGammaPhi(0.1);
      resetToState("excited");
    }
  };

  // Run initial state setup on mount
  useEffect(() => {
    resetToState("excited");
  }, []);

  // RK4 solver loop
  useEffect(() => {
    if (!isPlaying) return;

    let animFrameId: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const elapsed = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Cap dt to prevent massive jumps when tab is inactive
      const dtMax = 0.05;
      const dtSim = Math.min(elapsed, dtMax);

      // Solver equations of motion
      const getDerivatives = (x: number, y: number, z: number) => {
        const { omega: O, detuning: D, gamma: G, gammaPhi: GP } = simRef.current;
        const dx = -D * y - (G / 2 + GP) * x;
        const dy = D * x - O * z - (G / 2 + GP) * y;
        const dz = O * y - G * (z + 1);
        return { dx, dy, dz };
      };

      // RK4 step helper
      const rk4 = (x: number, y: number, z: number, dt: number) => {
        const k1 = getDerivatives(x, y, z);
        const k2 = getDerivatives(x + 0.5 * dt * k1.dx, y + 0.5 * dt * k1.dy, z + 0.5 * dt * k1.dz);
        const k3 = getDerivatives(x + 0.5 * dt * k2.dx, y + 0.5 * dt * k2.dy, z + 0.5 * dt * k2.dz);
        const k4 = getDerivatives(x + dt * k3.dx, y + dt * k3.dy, z + dt * k3.dz);

        return {
          x: x + (dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx),
          y: y + (dt / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy),
          z: z + (dt / 6) * (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz),
        };
      };

      // Integrate
      const current = simRef.current;
      const next = rk4(current.x, current.y, current.z, dtSim * 3); // speed multiplier of 3 for visibility
      
      current.x = next.x;
      current.y = next.y;
      current.z = next.z;
      current.t += dtSim * 3;

      // Keep vector inside Bloch sphere (numerical stability)
      const r = Math.sqrt(current.x * current.x + current.y * current.y + current.z * current.z);
      if (r > 1.0) {
        current.x /= r;
        current.y /= r;
        current.z /= r;
      }

      // Add to history
      const lastPoint = current.history[current.history.length - 1];
      if (!lastPoint || current.t - lastPoint.t > 0.05) {
        current.history.push({ x: current.x, y: current.y, z: current.z, t: current.t });
        // Keep last 150 points for visual trail
        if (current.history.length > 150) {
          current.history.shift();
        }
      }

      // Sync React state
      setState({ x: current.x, y: current.y, z: current.z });
      setTime(current.t);
      setHistory([...current.history]);

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isPlaying]);

  // 3D projection math
  const project = (x: number, y: number, z: number): ProjectedPoint => {
    const radius = 100;
    const centerX = 150;
    const centerY = 150;

    const radYaw = (yaw * Math.PI) / 180;
    const radPitch = (pitch * Math.PI) / 180;

    // 1. Rotate around vertical z-axis (yaw)
    const xRot = x * Math.cos(radYaw) - y * Math.sin(radYaw);
    const yRot = x * Math.sin(radYaw) + y * Math.cos(radYaw);
    const zRot = z;

    // 2. Rotate around horizontal axis (pitch)
    const xProj = yRot;
    const yProj = zRot * Math.cos(radPitch) - xRot * Math.sin(radPitch);
    const zProj = zRot * Math.sin(radPitch) + xRot * Math.cos(radPitch); // depth

    return {
      x: centerX + radius * xProj,
      y: centerY - radius * yProj,
      depth: zProj,
    };
  };

  // Generate sphere grid coordinates
  const getGridPath = (type: "equator" | "xz" | "yz") => {
    const points: ProjectedPoint[] = [];
    const steps = 72;
    for (let i = 0; i <= steps; i++) {
      const theta = (i * 2 * Math.PI) / steps;
      let x = 0, y = 0, z = 0;
      if (type === "equator") {
        x = Math.cos(theta);
        y = Math.sin(theta);
      } else if (type === "xz") {
        x = Math.cos(theta);
        z = Math.sin(theta);
      } else {
        y = Math.cos(theta);
        z = Math.sin(theta);
      }
      points.push(project(x, y, z));
    }

    return points.reduce((acc, p, idx) => {
      return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y} `;
    }, "");
  };

  // Mouse Drag to Rotate Handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    angleStart.current = { yaw, pitch };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setYaw(angleStart.current.yaw - dx * 0.5);
    setPitch(Math.max(-80, Math.min(80, angleStart.current.pitch + dy * 0.5)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Compute metrics
  const pExcited = (1 + state.z) / 2;
  const pGround = (1 - state.z) / 2;
  const coherence = Math.sqrt(state.x * state.x + state.y * state.y) / 2;

  // Project axes endpoints
  const origin = project(0, 0, 0);
  const posX = project(1.2, 0, 0);
  const negX = project(-1.0, 0, 0);
  const posY = project(0, 1.2, 0);
  const negY = project(0, -1.0, 0);
  const posZ = project(0, 0, 1.25);
  const negZ = project(0, 0, -1.25);

  // Project state vector and trail
  const currentProj = project(state.x, state.y, state.z);
  const trailPath = history.reduce((acc, p, idx) => {
    const proj = project(p.x, p.y, p.z);
    return acc + `${idx === 0 ? "M" : "L"} ${proj.x} ${proj.y} `;
  }, "");

  return (
    <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 shadow-xl max-w-5xl mx-auto mb-16">
      <div className="grid md:grid-cols-12 gap-8 items-center">
        {/* Left Side: 3D Bloch Sphere Visualizer */}
        <div className="md:col-span-5 flex flex-col items-center select-none">
          <h4 className="text-sm font-semibold text-rose-400 mb-2 tracking-wider uppercase">
            3D Bloch Sphere
          </h4>
          <p className="text-xs text-muted text-center max-w-xs mb-4">
            Drag sphere to rotate. Trajectory trail shows density matrix evolution.
          </p>

          <div className="relative bg-background/40 rounded-full border border-border/40 p-4 shadow-inner">
            <svg
              width="300"
              height="300"
              viewBox="0 0 300 300"
              className="cursor-grab active:cursor-grabbing overflow-visible"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* Sphere Outer Boundary */}
              <circle
                cx="150"
                cy="150"
                r="100"
                fill="url(#sphereGrad)"
                stroke="rgba(244,63,94,0.15)"
                strokeWidth="1.5"
              />

              {/* Equator & Meridians */}
              <path d={getGridPath("equator")} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3,3" />
              <path d={getGridPath("xz")} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3,3" />
              <path d={getGridPath("yz")} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3,3" />

              {/* Coordinate Axes */}
              {/* -X Axis (dashed) */}
              <line x1={origin.x} y1={origin.y} x2={negX.x} y2={negX.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" />
              {/* -Y Axis (dashed) */}
              <line x1={origin.x} y1={origin.y} x2={negY.x} y2={negY.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" />
              {/* -Z Axis (dashed) */}
              <line x1={origin.x} y1={origin.y} x2={negZ.x} y2={negZ.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2,2" />

              {/* +X Axis */}
              <line x1={origin.x} y1={origin.y} x2={posX.x} y2={posX.y} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              {/* +Y Axis */}
              <line x1={origin.x} y1={origin.y} x2={posY.x} y2={posY.y} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              {/* +Z Axis */}
              <line x1={origin.x} y1={origin.y} x2={posZ.x} y2={posZ.y} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

              {/* Axis State Labels */}
              <text x={posZ.x} y={posZ.y - 6} fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="monospace" textAnchor="middle">|1⟩</text>
              <text x={negZ.x} y={negZ.y + 12} fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace" textAnchor="middle">|0⟩</text>
              <text x={posX.x + 6} y={posX.y + 3} fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">|+⟩</text>
              <text x={posY.x + 4} y={posY.y - 2} fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">|+i⟩</text>

              {/* Trajectory Trail */}
              {trailPath && (
                <path
                  d={trailPath}
                  fill="none"
                  stroke="rgba(244,63,94,0.65)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
              )}

              {/* Current State Vector */}
              <line
                x1={origin.x}
                y1={origin.y}
                x2={currentProj.x}
                y2={currentProj.y}
                stroke="#f43f5e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle
                cx={currentProj.x}
                cy={currentProj.y}
                r="5.5"
                fill="#f43f5e"
                stroke="#fff"
                strokeWidth="1.5"
              />

              {/* SVG Definitions */}
              <defs>
                <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="70%" stopColor="rgba(255,255,255,0.01)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
                </radialGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>

          {/* Current Values Panel */}
          <div className="w-full mt-6 bg-background/50 rounded-xl p-4 border border-border/40 text-xs font-mono grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-muted mb-1 font-sans">Bloch Vector</div>
              <div className="text-rose-400">
                x: {state.x.toFixed(2)}<br />
                y: {state.y.toFixed(2)}<br />
                z: {state.z.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted mb-1 font-sans">Populations</div>
              <div className="text-foreground">
                P(excited): {pExcited.toFixed(2)}<br />
                P(ground): {pGround.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted mb-1 font-sans">Coherence</div>
              <div className="text-foreground">
                |ρ₀₁|: {coherence.toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Controls & Plots */}
        <div className="md:col-span-7 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground flex items-center justify-between">
              <span>Interactive Lindblad Simulation</span>
              <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-1 rounded border border-rose-500/20 font-mono">
                dt = {time.toFixed(1)}s
              </span>
            </h3>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                { id: "rabi", label: "Rabi Cycles" },
                { id: "t1", label: "T₁ Decay" },
                { id: "t2", label: "T₂ Dephasing" },
                { id: "steady", label: "Steady State" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id as any)}
                  className="bg-background hover:bg-background/80 hover:border-rose-500/50 text-xs py-2 px-3 rounded-lg border border-border/50 text-center transition-colors text-muted hover:text-foreground font-semibold"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-4 mb-6">
              {/* Omega Slider */}
              <div className="bg-background/30 rounded-xl p-3 border border-border/40">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-muted flex items-center gap-1">
                    <span>Drive Strength (Ω)</span>
                  </label>
                  <span className="text-xs font-mono text-rose-400">{omega.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.05"
                  value={omega}
                  onChange={(e) => setOmega(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-background border border-border/50 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Detuning Slider */}
              <div className="bg-background/30 rounded-xl p-3 border border-border/40">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-muted">Detuning (Δ)</label>
                  <span className="text-xs font-mono text-rose-400">{detuning.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.05"
                  value={detuning}
                  onChange={(e) => setDetuning(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-background border border-border/50 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Decay Rate Slider */}
              <div className="bg-background/30 rounded-xl p-3 border border-border/40">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-muted">T₁ Relaxation Rate (γ)</label>
                  <span className="text-xs font-mono text-rose-400">{gamma.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.02"
                  value={gamma}
                  onChange={(e) => setGamma(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-background border border-border/50 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Dephasing Slider */}
              <div className="bg-background/30 rounded-xl p-3 border border-border/40">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-muted">T₂ Dephasing Rate (γ_φ)</label>
                  <span className="text-xs font-mono text-rose-400">{gammaPhi.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.02"
                  value={gammaPhi}
                  onChange={(e) => setGammaPhi(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-background border border-border/50 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            {/* Initial State Selectors */}
            <div className="flex items-center justify-between mb-6 text-xs bg-background/30 rounded-xl p-3 border border-border/40">
              <span className="font-semibold text-muted">Initial State:</span>
              <div className="flex gap-2">
                {[
                  { id: "excited", label: "|1⟩" },
                  { id: "ground", label: "|0⟩" },
                  { id: "superposition", label: "|+⟩" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => resetToState(s.id as any)}
                    className={`px-3 py-1 rounded-md border font-semibold transition-colors ${
                      initialStateName === s.id
                        ? "bg-rose-500 border-rose-600 text-white"
                        : "bg-background border-border/50 text-muted hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Series Populations Line Plot */}
          <div className="mb-6 bg-background/50 rounded-xl p-4 border border-border/40">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-muted">Real-time Populations</span>
              <div className="flex gap-4 text-[10px] font-semibold">
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> P(excited)
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> P(ground)
                </span>
              </div>
            </div>

            <div className="w-full h-24 relative overflow-visible">
              <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="overflow-visible">
                {/* Gridlines */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="10" x2="400" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Plot Paths */}
                {history.length > 1 && (() => {
                  const getPlotPath = (type: "excited" | "ground") => {
                    return history.reduce((acc, p, idx) => {
                      const xProj = (idx / (history.length - 1)) * 400;
                      const pop = type === "excited" ? (1 + p.z) / 2 : (1 - p.z) / 2;
                      const yProj = 100 - (pop * 80 + 10); // scale 0-1 into Y coordinate range 90 to 10
                      return acc + `${idx === 0 ? "M" : "L"} ${xProj} ${yProj} `;
                    }, "");
                  };

                  return (
                    <>
                      <path d={getPlotPath("excited")} fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                      <path d={getPlotPath("ground")} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 font-bold py-3 px-6 rounded-xl border shadow-lg transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 ${
                isPlaying
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                  : "bg-rose-500 border-rose-600 text-white hover:bg-rose-600 shadow-rose-900/10"
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Simulate
                </>
              )}
            </button>

            <button
              onClick={() => resetToState(initialStateName)}
              className="bg-background border border-border/50 text-muted hover:text-foreground font-bold py-3 px-6 rounded-xl hover:bg-background/80 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 3v2m-6 4H21V3" />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
