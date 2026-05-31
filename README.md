# EMP Defense System Monitor

A React + TypeScript Vite application that simulates an EMP defense system monitoring dashboard. The UI presents a live radar console, hardware pin and register inspector, and a retro cyber-warfare status display.

## Live Demo

https://emp-defense-system-monitor-890838125719.asia-southeast1.run.app/

## Project Overview

This project is a themed monitoring interface built with modern front-end web technologies. It includes:

- Real-time radar simulation with target tracking and dynamic sweep animation
- Interactive Arduino-style hardware map and pin-level component inspector
- Console-style telemetry and status panels inspired by tactical defense command systems
- Audio alert simulation via browser sound generation

## Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- React Markdown

## Installation

### Prerequisites

- Node.js (recommended 18+)
- npm

### Local Setup

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the development server
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal (default is `http://localhost:3000`)

## Available Scripts

- `npm run dev` — Start the Vite development server
- `npm run build` — Build the production app into `dist/`
- `npm run preview` — Preview the production build locally
- `npm run clean` — Remove generated build files
- `npm run lint` — Run TypeScript type-checking

## Folder Structure

- `src/` — Source code
  - `App.tsx` — Main application shell and tab navigation
  - `main.tsx` — React entry point
  - `components/HardwareMap.tsx` — Interactive hardware schematic panel
  - `components/RadarSimulation.tsx` — Radar canvas simulation and controls
  - `index.css` — Global styling
- `index.html` — Vite HTML entry template

## Notes

- The app is primarily a front-end simulator and does not require a backend service to run.
- The dashboard is styled with a cyberpunk/retro terminal theme and is designed for visual presentation and education.

## Author

Built by Amish Aslam
