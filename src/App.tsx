import React, { useState } from "react";
import { 
  Shield, 
  Cpu, 
  Radio, 
  Zap
} from "lucide-react";
import { RadarSimulation } from "./components/RadarSimulation";
import { HardwareMap } from "./components/HardwareMap";
import { UserConfig } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"radar" | "hardware">("radar");

  // Keep developer configuration parameters for display purposes in the footer
  const [useConfig] = useState<UserConfig>({
    fullname: "Amish Aslam",
    email: "amishaslam302@gmail.com",
    projectTitle: "EMP Based Defense System",
    githubRepo: "https://github.com/amishaslam/emp-radar-system",
    linkedinProfile: "https://www.linkedin.com/in/amishaslam/",
    university: "University Department of Computer Science",
    courseName: "Computer Architecture - CSE-303",
    hardwareVersion: "v2.0.4-Armed"
  });

  return (
    <div className="min-h-screen bg-[#050705] text-[#00FF41] flex flex-col font-mono select-none border-4 border-[#003300] crt-flicker selection:bg-[#00FF41]/20 selection:text-[#00FF41]">
      
      {/* High Density Tactical Header Block */}
      <header className="h-16 border-b border-[#00FF41] flex items-center justify-between px-6 bg-[#081208] relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#00FF41]/40"></div>
        
        {/* Main Title branding */}
        <div className="flex items-center space-x-4">
          <div className="w-3.5 h-3.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_10px_#00FF41]"></div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-widest text-[#00FF41] uppercase terminal-glow flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-[#00FF41] inline" />
              <span>EMP DEFENSE SYSTEM :: MONITOR_V2.0.4</span>
            </h1>
            <p className="text-[9px] text-white/50 font-semibold tracking-wider font-mono -mt-0.5">
              SECURE SECTOR RADAR MONITOR • AUTOMATIC ACTIVE DEFENSE INTRUSION INTERCEPT
            </p>
          </div>
        </div>

        {/* Dense telemetry status panel */}
        <div className="hidden lg:flex space-x-6 text-[10px] font-mono font-bold leading-tight">
          <span className="flex flex-col border-l border-[#00FF41]/30 pl-3">
            <span className="text-[#00FF41]/60">UPTIME</span>
            <span className="text-white">04:12:09</span>
          </span>
          <span className="flex flex-col border-l border-[#00FF41]/30 pl-3">
            <span className="text-[#00FF41]/60">PORT</span>
            <span className="text-white">COM5 / 9600 BAUD</span>
          </span>
          <span className="flex flex-col border-l border-[#00FF41]/30 pl-3">
            <span className="text-[#00FF41]/60">COIL TEMP</span>
            <span className="text-[#FF3B3B] animate-pulse">42.5°C</span>
          </span>
          <span className="flex flex-col border-l border-[#00FF41]/30 pl-3">
            <span className="text-[#00FF41]/60">STATUS</span>
            <span className="text-[#00FF41] font-black terminal-glow">ARMED</span>
          </span>
        </div>

      </header>

      {/* Main page content layout container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        
        {/* Course Presentation introduction block in Green Matrix high-density style */}
        <div className="bg-[#020502]/90 border border-[#00FF41] p-5 relative overflow-hidden">
          {/* Radial grid background decoration */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #00FF41 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#00FF41]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-1.5 max-w-3xl">
              <span className="text-[10px] px-2 py-0.5 bg-[#00FF41] text-[#050705] font-black tracking-widest uppercase">
                TACTICAL COMMAND STATUS :: MONITOR ACTIVE
              </span>
              <h2 className="font-display text-lg md:text-xl font-black text-white tracking-widest uppercase">
                EMP DEFENSE TELEMETRY & CONTROLS
              </h2>
              <p className="text-xs text-white/80 leading-relaxed font-sans font-medium">
                Real-time tracking of defensive sectors, active signal echos filtration, and step-by-step MCU pin mappings. Use the control console to simulate airborne targets, monitor the sliding window debounce filter, and view hardware signal integration routes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
              <span className="px-3 py-1.5 bg-[#003300]/20 border border-[#00FF41]/35 rounded text-[10px] text-white flex items-center space-x-1">
                <span>SECTOR:</span>
                <span className="text-[#00FF41] font-bold">SUB-03 ACTIVE</span>
              </span>
              <span className="px-3 py-1.5 bg-[#003300]/20 border border-[#00FF41]/35 rounded text-[10px] text-white flex items-center space-x-1">
                <span>SYSTEM STATE:</span>
                <span className="text-[#00FF41] font-bold uppercase">SECURED</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection Switches Grid (Dense green layout blocks) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#020502] p-2 border border-[#00FF41]/40">
          <button
            onClick={() => setActiveTab("radar")}
            className={`p-3 border text-left transition duration-200 flex flex-col justify-between h-20 ${
              activeTab === "radar"
                ? "bg-[#00FF41] border-[#00FF41] text-[#050705]"
                : "bg-transparent border-[#00FF41]/20 hover:border-[#00FF41]/60 text-[#00FF41]/70 hover:text-[#00FF41]"
            }`}
          >
            <Radio className="h-4 w-4" />
            <div>
              <div className="text-[9px] font-mono tracking-widest font-black uppercase opacity-80">MONITOR_A</div>
              <div className="font-display font-bold text-xs uppercase tracking-wider mt-0.5">Live Console Sim</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("hardware")}
            className={`p-3 border text-left transition duration-200 flex flex-col justify-between h-20 ${
              activeTab === "hardware"
                ? "bg-[#00FF41] border-[#00FF41] text-[#050705]"
                : "bg-transparent border-[#00FF41]/20 hover:border-[#00FF41]/60 text-[#00FF41]/70 hover:text-[#00FF41]"
            }`}
          >
            <Cpu className="h-4 w-4" />
            <div>
              <div className="text-[9px] font-mono tracking-widest font-black uppercase opacity-80">HARDWARE_B</div>
              <div className="font-display font-bold text-xs uppercase tracking-wider mt-0.5">Registers Schematic</div>
            </div>
          </button>
        </div>

        {/* Dynamic Inner Tab Router Render Panel */}
        <div className="transition-all duration-300">
          {activeTab === "radar" && <RadarSimulation />}
          {activeTab === "hardware" && <HardwareMap />}
        </div>

        {/* Dynamic System Output Logs (Aesthetic matching the template exactly) */}
        <div className="bg-[#020502] border border-[#00FF41] p-4 text-[10px] space-y-1 hover:border-[#00FF41] transition duration-200">
          <div className="flex justify-between font-bold border-b border-[#00FF41]/35 pb-1 mb-2 text-[#00FF41]/70">
            <span>TERMINAL SERIAL STREAM MONITOR LOGS</span>
            <span>ACTIVE COM PORT LINK : RECONV</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#00FF41]/80 font-mono">
            <div>&gt; [COM5] BAUD=9600 INIT_OK</div>
            <div>&gt; [SYS_BOARD] ATmega328P DETECTED SUCCESSFULLY</div>
            <div>&gt; [RADAR_SWEEP] SWEEP CLOCK ANGLE 15°-165° SET_OK (SERVO_DELAY=30ms)</div>
            <div className="text-[#FF3B3B] animate-pulse">&gt; [SLIDING_FILTER] CURRENT WEIGHT LOAD: ZERO IN STANDBY</div>
          </div>
        </div>

      </main>

      {/* Structured Tactical high density footer */}
      <footer className="border-t border-[#00FF41] bg-[#081208] py-5 px-6 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono leading-none gap-4">
        <div className="flex space-x-6 text-white/80">
          <span>CPU_LOAD: 12%</span>
          <span>MEM: 1.4kb / 2.0kb</span>
          <span className="text-[#00FF41] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-ping inline-block"></span>
            THREAD_0: RUNNING
          </span>
        </div>
        
        <div className="text-[#00FF41]/45 font-mono flex items-center space-x-2">
          <span>DEVELOPER PROFILE REGISTER: {useConfig.fullname.toUpperCase()}</span>
          <span>•</span>
          <span>SECURITY CLOCK STATE: SYNCHRONIZED</span>
        </div>
      </footer>

    </div>
  );
}
