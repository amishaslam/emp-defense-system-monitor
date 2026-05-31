import React, { useState } from "react";
import { Cpu, Terminal, Sparkles, Volume2, Waves, Compass, Layers } from "lucide-react";

interface ComponentDetail {
  id: string;
  name: string;
  pin: string;
  role: string;
  architectureDetails: string;
  specs: string;
}

export function HardwareMap() {
  const [selectedComp, setSelectedComp] = useState<string>("sonar");

  const components: Record<string, ComponentDetail> = {
    sonar: {
      id: "sonar",
      name: "Ultrasonic HC-SR04 Sensor",
      pin: "Trig (D10) / Echo (D11)",
      role: "Perimeter Distance Capture",
      specs: "2cm – 400cm range (Configured boundary: 40cm), 15000µs polling timeout.",
      architectureDetails: "Hardware triggers logic. Solves blocking issues by compressing timeout duration down to 15ms. Measures 58µs/cm echo return times. Connected directly to input registers."
    },
    servo: {
      id: "servo",
      name: "Micro Servo Sweep Motor",
      pin: "PWM out (D12)",
      role: "Continuous Polar Sweeping (15° – 165°)",
      specs: "5V operation, non-blocking 30ms sweep clock steps.",
      architectureDetails: "Executes continuous motion loops scheduled at distinct interval blocks using millis() timestamp offset. Completely replaces blocking delays to ensure continuous signal sweep."
    },
    buzzer: {
      id: "buzzer",
      name: "Active Warning Piezo Buzzer",
      pin: "Digital out (D8)",
      role: "Acoustic Proximity Alerting",
      specs: "Blink speeds modulated actively: High priority (150ms) | Med (300ms) | Low (600ms).",
      architectureDetails: "Simulates digital output level modulation without state blocks. Warns users physically of target ingress speeds."
    },
    coil: {
      id: "coil",
      name: "Step-up Transformer & Copper Coil",
      pin: "Digital Out (D7)",
      role: "EMP Deflection Actuator (Simulated)",
      specs: "Transistor switch gate. 5V step-up charging transformer triggering induction loop.",
      architectureDetails: "Acts as the physical output device (actuator). Energizes only when sliding window calculations verify continuous target breach. Highly insulated to prevent chip EMI damage."
    },
    led: {
      id: "led",
      name: "Boundary Indication State LED",
      pin: "Digital Board LED (D13)",
      role: "Optical Visual Alarm Indicator",
      specs: "Matches Piezo buzzer signal frequency actively.",
      architectureDetails: "Blinks on the same scheduled timeline as the buzzer to represent visual and physical boundaries simultaneously inside multi-threaded emulation."
    },
    controller: {
      id: "controller",
      name: "Arduino Uno Core (Atmega328P)",
      pin: "Onboard System Controller",
      role: "Core Execution CPU & Register Unit",
      specs: "16MHz Clock Rate, 32KB Flash Storage, 2KB SRAM size.",
      architectureDetails: "The central processing system managing registers, arithmetic logic calculations, inputs polling, sliding window queue buffers, and driving outputs concurrently."
    }
  };

  return (
    <div className="bg-[#020502] border border-[#00ff41] p-6 relative space-y-6">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#00ff41]/50"></div>
      
      <div className="border-b border-[#00ff41]/35 pb-4">
        <h2 className="font-display text-base font-black tracking-widest text-[#00ff41] uppercase">
          SYSTEM INTERACTIVE PIN ARCHITECTURE & SCHEMATICS
        </h2>
        <p className="text-xs text-white/70 font-sans mt-1">
          Explore connection schematics, discrete registers, and the microinstruction execution logic of each Arduino UNO component.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Interactive Schematic visual diagram */}
        <div className="md:col-span-7 flex flex-col space-y-4">
          <span className="text-[10px] text-[#00ff41]/60 font-mono uppercase tracking-widest font-bold">CIRC_REGISTERS: Microcontroller Pin Mapping Diagram</span>
          
          <div className="bg-[#020502] border border-[#00ff41]/40 p-4 md:p-6 flex flex-col justify-between items-center min-h-[320px] relative overflow-hidden">
            {/* Ambient circuit tracks drawing */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-[#00ff41]" />
              <div className="absolute left-1/3 top-6 bottom-6 w-[1px] bg-[#00ff41]" />
            </div>

            {/* Core UNO Representation */}
            <div className="relative z-10 w-full max-w-sm bg-[#050a05] border-2 border-[#00ff41] p-4 flex flex-col items-center select-none">
              <div className="w-full flex justify-between items-center border-b border-[#00ff41]/30 pb-2 mb-4 font-mono text-[10px] text-[#00ff41]">
                <span className="flex items-center font-black">
                  <Cpu className="h-3.5 w-3.5 mr-1" />
                  ATmega328P BOARD
                </span>
                <span>COM5 READY</span>
              </div>

              {/* Pin Rows Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full font-mono text-xs">
                {/* Inputs Left */}
                <div className="space-y-2">
                  <div className="text-[9px] text-[#00ff41]/70 font-black tracking-wider uppercase">INPUT REGISTER</div>
                  
                  <button
                    onClick={() => setSelectedComp("sonar")}
                    className={`w-full px-2.5 py-1.5 text-left border rounded-none flex items-center justify-between transition ${
                      selectedComp === "sonar"
                        ? "bg-[#00ff41] text-[#020502] border-[#00ff41] font-bold"
                        : "bg-transparent border-[#00ff41]/35 text-[#00ff41]"
                    }`}
                  >
                    <span>D10/D11 Sonic</span>
                    <span className="text-[9px] font-bold">IN</span>
                  </button>

                  <button
                    onClick={() => setSelectedComp("controller")}
                    className={`w-full px-2.5 py-1.5 text-left border rounded-none flex items-center justify-between transition ${
                      selectedComp === "controller"
                        ? "bg-[#00ff41] text-[#020502] border-[#00ff41] font-bold"
                        : "bg-transparent border-[#00ff41]/35 text-[#00ff41]"
                    }`}
                  >
                    <span>Core Board</span>
                    <span className="text-[9px] font-bold">MCU</span>
                  </button>
                </div>

                {/* Outputs Right */}
                <div className="space-y-2">
                  <div className="text-[9px] text-[#00ff41]/70 font-black tracking-wider uppercase">OUTPUT REGISTER</div>

                  <button
                    onClick={() => setSelectedComp("servo")}
                    className={`w-full px-2.5 py-1.5 text-left border rounded-none flex items-center justify-between transition ${
                      selectedComp === "servo"
                        ? "bg-[#00ff41] text-[#020502] border-[#00ff41] font-bold"
                        : "bg-transparent border-[#00ff41]/35 text-[#00ff41]"
                    }`}
                  >
                    <span>D12 Sweep</span>
                    <span className="text-[9px] font-bold">PWM</span>
                  </button>

                  <button
                    onClick={() => setSelectedComp("coil")}
                    className={`w-full px-2.5 py-1.5 text-left border rounded-none flex items-center justify-between transition ${
                      selectedComp === "coil"
                        ? "bg-[#00ff41] text-[#020502] border-[#00ff41] font-bold"
                        : "bg-transparent border-[#00ff41]/35 text-[#00ff41]"
                    }`}
                  >
                    <span>D7 Coil Pin</span>
                    <span className="text-[9px] font-bold">HIGH</span>
                  </button>

                  <button
                    onClick={() => setSelectedComp("buzzer")}
                    className={`w-full px-2.5 py-1.5 text-left border rounded-none flex items-center justify-between transition ${
                      selectedComp === "buzzer"
                        ? "bg-[#00ff41] text-[#020502] border-[#00ff41] font-bold"
                        : "bg-transparent border-[#00ff41]/35 text-[#00ff41]"
                    }`}
                  >
                    <span>D8 Piezo Pin</span>
                    <span className="text-[9px] font-bold">OUT</span>
                  </button>

                  <button
                    onClick={() => setSelectedComp("led")}
                    className={`w-full px-2.5 py-1.5 text-left border rounded-none flex items-center justify-between transition ${
                      selectedComp === "led"
                        ? "bg-[#00ff41] text-[#020502] border-[#00ff41] font-bold"
                        : "bg-transparent border-[#00ff41]/35 text-[#00ff41]"
                    }`}
                  >
                    <span>D13 LED Pin</span>
                    <span className="text-[9px] font-bold">OUT</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hint overlay instruction */}
            <span className="text-[10px] font-mono text-[#00ff41]/75 mt-4">
              💡 CLICK INDIVIDUAL REGISTERS ABOVE TO DECYPHER INSTRUCTION BLOCK SPECS
            </span>
          </div>
        </div>

        {/* Selected register specification inspect panel */}
        <div className="md:col-span-5 flex flex-col">
          <span className="text-[10px] text-[#00ff41]/60 font-mono uppercase tracking-widest mb-4 font-bold">CORE_SPECS: Hardware Inspector Block</span>

          <div className="bg-[#020502] border border-[#00ff41]/50 p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#00ff41]/35 pb-3">
                <span className="font-display font-black text-xs text-[#00ff41] uppercase tracking-wider">
                  {components[selectedComp].name}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 bg-[#00ff41]/10 border border-[#00ff41]/40 font-bold text-[#00ff41]">
                  {components[selectedComp].pin}
                </span>
              </div>

              <div className="space-y-3.5 text-xs text-white leading-relaxed font-mono">
                <div>
                  <span className="block text-[9px] font-black text-[#00ff41]/60 uppercase tracking-widest mb-1">
                    PRIMARY REGISTER DUTY:
                  </span>
                  <p className="font-bold text-[#00ff41]">{components[selectedComp].role}</p>
                </div>

                <div>
                  <span className="block text-[9px] font-black text-[#00ff41]/60 uppercase tracking-widest mb-1">
                    HARDWARE DATASHEET SPECS:
                  </span>
                  <p className="text-[11px] text-[#00ff41]/90 leading-normal">{components[selectedComp].specs}</p>
                </div>

                <div>
                  <span className="block text-[9px] font-black text-[#00ff41]/60 uppercase tracking-widest mb-1 flex items-center">
                    <Layers className="h-3 w-3 mr-1 text-[#00ff41]" />
                    COMPUTER ARCHITECTURE INTEGRATIONS:
                  </span>
                  <p className="p-3 bg-[#050a05] border border-[#00ff41]/25 text-white/95 text-[11px] leading-relaxed">
                    {components[selectedComp].architectureDetails}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-[#00ff41]/50 tracking-widest font-mono mt-6 pt-3 border-t border-[#00ff41]/15 text-right font-bold uppercase">
              REGISTER BUS ALLOCATED SECTOR_01
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
