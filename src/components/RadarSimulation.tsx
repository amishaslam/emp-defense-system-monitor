import React, { useRef, useEffect, useState, useMemo } from "react";
import { Shield, Zap, Volume2, VolumeX, RefreshCw, CircleAlert, CheckCircle, Radio } from "lucide-react";

// Web Audio API helper for modular sound alerts mimicking the Arduino buzzer
class WarningBuzzer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  public enabled: boolean = false;
  private activeIntervalId: NodeJS.Timeout | null = null;
  private isBeeping: boolean = false;

  constructor() {
    // Initialized lazily on first user interaction to handle browser security protocols
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    this.init();
    if (!val) {
      this.stopBeeps();
    }
  }

  private stopBeeps() {
    if (this.activeIntervalId) {
      clearInterval(this.activeIntervalId);
      this.activeIntervalId = null;
    }
    this.isBeeping = false;
  }

  public triggerBeepSchedule(distance: number) {
    this.init();
    if (!this.enabled || !this.ctx) {
      this.stopBeeps();
      return;
    }

    let interval = 0;
    if (distance <= 10) interval = 150;
    else if (distance <= 20) interval = 300;
    else if (distance <= 40) interval = 600;
    else {
      this.stopBeeps();
      return;
    }

    // If interval changed or not running, clear and restart
    this.stopBeeps();

    this.activeIntervalId = setInterval(() => {
      this.beep();
    }, interval);
  }

  private beep() {
    if (!this.ctx || this.ctx.state === "suspended") return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime); // Piezo high beep sound
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio beep error:", e);
    }
  }

  public destroy() {
    this.stopBeeps();
    if (this.ctx) {
      this.ctx.close();
    }
  }
}

export function RadarSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sound Config
  const [audioEnabled, setAudioEnabled] = useState(false);
  const buzzer = useMemo(() => new WarningBuzzer(), []);

  // System Setup State
  const [sweepAngle, setSweepAngle] = useState(15);
  const [sweepDirection, setSweepDirection] = useState(1); // 1 for clockwise, -1 for counter-clockwise
  const [measuredDist, setMeasuredDist] = useState<number | null>(null);
  
  // Custom interactive list of targets
  const [targets, setTargets] = useState<{ id: number; angle: number; distance: number; status: "active" | "neutralized" }[]>([
    { id: 1, angle: 90, distance: 22, status: "active" },
    { id: 2, angle: 135, distance: 12, status: "active" },
    { id: 3, angle: 45, distance: 35, status: "active" }
  ]);

  // Sliding Window Simulation
  const [slidingWindow, setSlidingWindow] = useState<number[]>(Array(10).fill(0));
  const [windowIndex, setWindowIndex] = useState(0);
  const [controlOn, setControlOn] = useState(false);
  const [empActiveProgress, setEmpActiveProgress] = useState(0); // 0 to 100 sparks

  // Add target with double bounds filtering
  const addMockTarget = (angle: number, distance: number) => {
    const freshTarget = {
      id: Date.now(),
      angle: Math.max(15, Math.min(165, angle)),
      distance: Math.max(2, Math.min(60, distance)),
      status: "active" as const
    };
    setTargets(prev => [...prev.filter(t => Math.abs(t.angle - angle) > 10), freshTarget]);
  };

  // Sound activation toggle helper
  const handleToggleSound = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    buzzer.setEnabled(nextState);
  };

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      buzzer.destroy();
    };
  }, [buzzer]);

  // Main canvas and physical logic loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let localAngle = sweepAngle;
    let localDirection = sweepDirection;
    let localWindow = [...slidingWindow];
    let localIndex = windowIndex;
    let lastSensorUpdate = 0;

    // Fixed dimensions matching responsive panel (approx 650x420)
    const cw = 700;
    const ch = 450;
    canvas.width = cw;
    canvas.height = ch;

    const cx = cw / 2;
    const cy = ch - 50;
    const maxRadius = Math.min(cw / 2 - 30, ch - 80);
    const scaleFactor = maxRadius / 40.0; // Range max represents 40cm, overflow scales out

    const loop = (timestamp: number) => {
      // Step 1: Update Sweep Engine (Non-blocking timing simulation)
      localAngle += localDirection * 1.0; // 1 degree step per tick
      if (localAngle >= 165) {
        localAngle = 165;
        localDirection = -1;
      } else if (localAngle <= 15) {
        localAngle = 15;
        localDirection = 1;
      }
      setSweepAngle(Math.round(localAngle));
      setSweepDirection(localDirection);

      // Step 2: Live Scanning Distance Calculations (simulates ultrasonic echo timing bounds)
      let activeTargetInRange = false;
      let minDistance = 400; // Standby infinite range marker

      // Find closest active targets in vicinity of the sweeping polar line
      targets.forEach(t => {
        if (t.status === "active") {
          const deltaAngle = Math.abs(t.angle - localAngle);
          // Angle corridor matching sensor cone width
          if (deltaAngle < 3.5) {
            activeTargetInRange = true;
            if (t.distance < minDistance) {
              minDistance = t.distance;
            }
          }
        }
      });

      // Update calculations periodically to emulate actual Arduino poll loops
      if (timestamp - lastSensorUpdate >= 30) {
        lastSensorUpdate = timestamp;
        
        let inDetectionRange = activeTargetInRange && minDistance <= 40;
        let sensorResult = inDetectionRange ? 1 : 0;
        setMeasuredDist(activeTargetInRange ? minDistance : null);

        // Slide the data point into the sliding window queue representation
        localWindow[localIndex] = sensorResult;
        localIndex = (localIndex + 1) % 10;
        
        setSlidingWindow([...localWindow]);
        setWindowIndex(localIndex);

        // Sliding window state evaluation rules
        const windowSum = localWindow.reduce((a, b) => a + b, 0);
        
        // Match user's ON_THRESHOLD = 3
        if (windowSum >= 3) {
          setControlOn(true);
        }
        // Match user's OFF_THRESHOLD = 4 (for resetting)
        if (windowSum <= 4 && windowSum === 0) {
          setControlOn(false);
        }

        // Active Warning Sound Pacing trigger
        if (inDetectionRange && minDistance <= 40) {
          buzzer.triggerBeepSchedule(minDistance);
        } else {
          buzzer.triggerBeepSchedule(999); // Off alert range
        }
      }

      // Live EMP Pulse actuator discharge rendering pipeline
      setControlOn(currentControlOn => {
        if (currentControlOn) {
          setEmpActiveProgress(p => {
            const nextVal = p + 4;
            if (nextVal >= 100) {
              // ZAP neutralization trigger
              setTargets(prevTargets => {
                return prevTargets.map(t => {
                  const angleDiff = Math.abs(t.angle - localAngle);
                  if (angleDiff < 15 && t.distance <= 40 && t.status === "active") {
                    return { ...t, status: "neutralized" };
                  }
                  return t;
                });
              });
              return 0; // Discharge discharge
            }
            return nextVal;
          });
        } else {
          setEmpActiveProgress(0);
        }
        return currentControlOn;
      });

      // Render Step 3: Clear and Frame redraw
      ctx.clearRect(0, 0, cw, ch);

      // Deep Space Green Background Canvas Fill
      ctx.fillStyle = "#020502";
      ctx.fillRect(0, 0, cw, ch);

      // A: Concentric Circular Range Ring Render
      for (let ring = 1; ring <= 4; ring++) {
        const ringRadius = ring * (maxRadius / 4.0);
        
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, Math.PI, 2 * Math.PI);
        ctx.strokeStyle = "rgba(0, 255, 65, 0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "rgba(0, 255, 65, 0.75)";
        ctx.font = "10px monospace";
        ctx.textAlign = "right";
        ctx.fillText(`${ring * 10}cm`, cx + ringRadius - 6, cy + 15);
      }

      // B: Angular Spokes Mapping Layout Lines
      for (let angle = 30; angle <= 150; angle += 30) {
        const rad = (180 - angle) * Math.PI / 180;
        const pointerX = cx + Math.cos(rad) * maxRadius;
        const pointerY = cy - Math.sin(rad) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pointerX, pointerY);
        ctx.strokeStyle = "rgba(0, 255, 65, 0.15)";
        ctx.lineWidth = 1.0;
        ctx.stroke();

        ctx.fillStyle = "#00ff41";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${angle}°`, pointerX + Math.cos(rad) * 16, pointerY - Math.sin(rad) * 8);
      }

      // C: Radar Horizon border
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, Math.PI, 2 * Math.PI, false);
      ctx.strokeStyle = "#00ff41";
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // D: Render Targets State Machine (Blips)
      targets.forEach(t => {
        const rad = (180 - t.angle) * Math.PI / 180;
        const tx = cx + Math.cos(rad) * (t.distance * scaleFactor);
        const ty = cy - Math.sin(rad) * (t.distance * scaleFactor);

        const isActive = t.status === "active";
        const isCritical = t.distance <= 15;
        const color = !isActive 
          ? "#ef4444" // Neutralized Drone - Dead red outline 
          : isCritical 
            ? "#ff3b30" // Critical danger warning
            : "#00ff41"; // High energy scanning green

        // Outer threat beacon pulse animation
        ctx.beginPath();
        ctx.arc(tx, ty, 15 + Math.sin(timestamp / 100) * 4, 0, 2 * Math.PI);
        ctx.strokeStyle = isActive ? `rgba(${isCritical ? "255, 59, 48" : "0, 255, 65"}, 0.35)` : "rgba(239, 68, 68, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Target Solid core
        ctx.beginPath();
        ctx.arc(tx, ty, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        // Neutralized cross marker overlay
        if (!isActive) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tx - 4, ty - 4); ctx.lineTo(tx + 4, ty + 4);
          ctx.moveTo(tx + 4, ty - 4); ctx.lineTo(tx - 4, ty + 4);
          ctx.stroke();
        }

        // Radar Distance Label text overlay
        ctx.fillStyle = color;
        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`${Math.round(t.distance)}cm (${t.status.toUpperCase()})`, tx + 10, ty - 4);
      });

      // E: Dynamic Backlight Trail scanning
      const trailLength = 15;
      for (let i = 0; i < trailLength; i++) {
        const targetAngle = localAngle - (localDirection * i * 1.2);
        if (targetAngle < 15 || targetAngle > 165) continue;
        const rad = (180 - targetAngle) * Math.PI / 180;
        const fadeValue = 1.0 - (i / trailLength);
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rad) * maxRadius, cy - Math.sin(rad) * maxRadius);
        ctx.strokeStyle = `rgba(0, 255, 65, ${0.18 * fadeValue})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // F: Active Physical sweeping emitter lines
      const sweepRad = (180 - localAngle) * Math.PI / 180;
      const sx = cx + Math.cos(sweepRad) * maxRadius;
      const sy = cy - Math.sin(sweepRad) * maxRadius;

      // Outer glow of current sweep
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = "rgba(0, 255, 65, 0.9)";
      ctx.lineWidth = 2.0;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#00ff41";
      ctx.fill();

      // G: Base Hub indicator drawing
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#020502";
      ctx.strokeStyle = "#00ff41";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [targets, sweepAngle, sweepDirection, slidingWindow, windowIndex]);

  // Render variables derived from states
  const windowSumCount = slidingWindow.reduce((a, b) => a + b, 0);
  return (
    <div id="radar-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#020502] border border-[#00ff41] p-6 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#00ff41]/50"></div>
      
      {/* Radar screen and controls column */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        <div className="flex items-center justify-between border-b border-[#00ff41]/30 pb-3">
          <div className="flex items-center space-x-2">
            <Radio className="h-5 w-4 text-[#00ff41] animate-pulse" />
            <h3 className="font-display font-black text-sm tracking-widest text-[#00ff41] uppercase">
              SECTOR SCANNER CONSOLE (UNIT_001)
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-none border transition-all duration-200 text-xs font-mono font-bold ${
                audioEnabled 
                  ? "bg-[#00ff41] border-[#00ff41] text-[#020502]"
                  : "bg-transparent border-[#00ff41]/30 text-[#00ff41]/70 hover:text-[#00ff41]"
              }`}
              title={audioEnabled ? "Mute Piezo" : "Armed Piezo Alert"}
            >
              {audioEnabled ? "PIEZO: ON" : "PIEZO: OFF"}
            </button>
            <button
              onClick={() => {
                setTargets([
                  { id: 1, angle: 90, distance: 22, status: "active" },
                  { id: 2, angle: 135, distance: 12, status: "active" },
                  { id: 3, angle: 45, distance: 35, status: "active" }
                ]);
                setSlidingWindow(Array(10).fill(0));
                setControlOn(false);
                setEmpActiveProgress(0);
              }}
              className="px-3 py-1.5 text-xs bg-transparent hover:bg-[#00ff41]/10 text-[#00ff41] font-mono border border-[#00ff41] rounded-none transition"
            >
              RESET_ARRAY
            </button>
          </div>
        </div>

        {/* Canvas Render Wrapper */}
        <div ref={containerRef} className="relative w-full overflow-hidden border border-[#00ff41]/45 bg-[#010301] shadow-2xl flex justify-center items-center p-2">
          <canvas ref={canvasRef} className="max-w-full drop-shadow-[0_0_20px_rgba(0,255,65,0.25)]" />
          
          {/* Quick interactive overlay targets adder panel */}
          <div className="absolute bottom-4 left-4 right-4 bg-[#050905]/95 border border-[#00ff41] p-3 text-xs flex flex-wrap gap-2 justify-between items-center z-10">
            <span className="text-white font-mono text-[10px] tracking-wider font-bold">DEPLOY FLIGHT EXERCISE INTRUDER:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => addMockTarget(60, 25)}
                className="px-2 py-1 bg-transparent hover:bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41] font-mono text-[10px]"
              >
                +60° TARGET (25cm)
              </button>
              <button
                onClick={() => addMockTarget(90, 8)}
                className="px-2 py-1 bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/20 text-[#FF3B3B] border border-[#FF3B3B] font-mono text-[10px]"
              >
                +90° THREAT (8cm)
              </button>
              <button
                onClick={() => addMockTarget(120, 38)}
                className="px-2 py-1 bg-transparent hover:bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40 font-mono text-[10px]"
              >
                +120° BOUNDARY (38cm)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Data Board and Computer Architecture Signal processing */}
      <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
        {/* Core telemetry registers */}
        <div className="bg-[#020502] p-4 border border-[#00ff41]/50 space-y-4">
          <div className="text-[#00ff41] text-xs tracking-widest font-mono border-b border-[#00ff41]/30 pb-2 flex justify-between font-bold">
            <span>REGISTER TELEMETRY</span>
            <span className="text-[#00ff41] animate-pulse">● SWEEPING</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="bg-[#050a05] p-3 border border-[#00ff41]/30">
              <div className="text-[9px] text-[#00ff41]/60 font-bold uppercase">SWEEP_ANGLE</div>
              <div className="text-xl font-bold text-white mt-1 font-mono">{sweepAngle}°</div>
              <div className="text-[9px] text-[#00ff41]/50 mt-0.5">Servo Axis Register</div>
            </div>
            <div className="bg-[#050a05] p-3 border border-[#00ff41]/30">
              <div className="text-[9px] text-[#00ff41]/60 font-bold uppercase">HC_SR04_DIST</div>
              <div className="text-xl font-bold text-[#00ff41] mt-1 font-mono">
                {measuredDist ? `${Math.round(measuredDist)}cm` : "---"}
              </div>
              <div className="text-[9px] text-[#00ff41]/50 mt-0.5">Calculated Input</div>
            </div>
          </div>

          <div className="bg-[#050a05] p-3 border border-[#00ff41]/30 flex items-center justify-between font-mono">
            <div>
              <div className="text-[9px] text-[#00ff41]/60 font-bold uppercase">SYSTEM_ALERT_BUZZER</div>
              <div className="text-xs font-bold mt-1 text-white">
                {measuredDist && measuredDist <= 10 
                  ? "CRITICAL (150ms DELAY)" 
                  : measuredDist && measuredDist <= 20 
                    ? "MEDIUM (300ms DELAY)" 
                    : measuredDist && measuredDist <= 40
                      ? "WARNING (600ms DELAY)"
                      : "STANDBY (CONTINUOUS)"}
              </div>
            </div>
          </div>
        </div>

        {/* Sliding Window Visualization Panel (Crucial Educational Computer Architecture Concept) */}
        <div className="bg-[#020502] p-4 border border-[#00ff41]/50 space-y-3.5">
          <div className="flex justify-between items-center">
            <div className="text-[#00ff41] text-xs tracking-widest font-semibold font-mono">
              SLIDING WINDOW DEBOUNCE
            </div>
            <span className="text-[9px] px-2 py-0.5 bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/35 font-mono">
              FIFO_Q.ino
            </span>
          </div>
          
          <p className="text-[11px] text-white/80 leading-relaxed font-sans font-medium">
            Filters static signal sparks and false ultrasonic echos using a rolling queue logic. Active reads write <span className="text-[#00ff41] font-mono">1</span>, safe states write <span className="text-white/40 font-mono">0</span>.
          </p>

          {/* Visual array queue rendering */}
          <div className="grid grid-cols-10 gap-1.5 py-1">
            {slidingWindow.map((val, idx) => (
              <div
                key={idx}
                className={`relative h-9 flex flex-col items-center justify-center font-mono text-xs font-semibold border transition-all duration-300 ${
                  val === 1 
                    ? "bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]" 
                    : "bg-transparent border-[#00ff41]/25 text-white/30"
                }`}
                title={`Window Index [${idx}]`}
              >
                <span>{val}</span>
                {idx === (windowIndex - 1 + 10) % 10 && (
                  <div className="absolute -bottom-4 animate-bounce text-[8px] font-bold text-[#00ff41]">
                    ▲
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Logic thresholds parameters */}
          <div className="bg-[#050a05] p-3 border border-[#00ff41]/30 divide-y divide-[#00ff41]/15 font-mono text-[10px] text-white space-y-2 pt-2">
            <div className="flex justify-between pb-2 font-bold text-[#00ff41]/80">
              <span>REGISTER SUM:</span>
              <span className={windowSumCount > 0 ? "text-[#00ff41] font-bold" : "text-white/40"}>
                {windowSumCount} / 10 Active
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-white/50 font-semibold">ON_CONSTRAINTS (TRIGGER):</span>
              <span className="text-[#FF3B3B] font-bold">≥ 3 Readings</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-white/50 font-semibold">OFF_CONSTRAINTS (CLEAR):</span>
              <span className="text-[#00ff41] font-bold">= 0 Readings</span>
            </div>
          </div>
        </div>

        {/* Electromagnetic coil spark output pin status */}
        <div className={`p-4 border flex items-center justify-between transition-all duration-500 ${
          controlOn 
            ? "bg-[#FF3B3B]/10 border-[#FF3B3B] text-[#FF3B3B]" 
            : "bg-transparent border-[#00ff41]/40 text-[#00ff41]"
        }`}>
          <div className="space-y-1.5 flex-1 pr-4">
            <div className="flex items-center space-x-2">
              {controlOn ? (
                <span className="inline-flex h-2 w-2 rounded-full bg-[#FF3B3B] animate-ping" />
              ) : (
                <span className="inline-flex h-2 w-2 rounded-full bg-[#00ff41]" />
              )}
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">COIL_ACTUATOR_PIN (D7)</span>
            </div>
            <div className="text-sm font-black uppercase tracking-wider text-white">
              {controlOn ? "COIL STATE: DISCHARGING" : "COIL STATE: DISARMED"}
            </div>
            <div className="text-[10px] opacity-75 font-mono">
              {controlOn 
                ? "Emitting electromagnetic pulse wave..." 
                : "Active continuous airspace scan..."}
            </div>
          </div>

          <div className="relative h-12 w-12 border flex items-center justify-center bg-transparent border-[#00ff41]/30">
            {controlOn ? (
              <>
                <Zap className="h-6 w-6 text-[#FF3B3B] animate-pulse relative z-10" />
                <div className="absolute inset-0 bg-[#FF3B3B]/20 animate-ping scale-75" />
              </>
            ) : (
              <Shield className="h-6 w-6 text-[#00ff41]/60" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
