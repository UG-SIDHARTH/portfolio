# Sidharth D | Interactive Web OS Portfolio

> A premium, interactive, dark-mode UNIX/Mac hybrid Web OS desktop environment ("SidharthOS" or "CyberOS") built to showcase Sidharth's academic, hardware engineering, and Artificial Intelligence background.

## Live Demo

🌐 Portfolio: [ug-sidharth.github.io/portfolio](https://ug-sidharth.github.io/portfolio)

## Repository

📦 GitHub Repository: [github.com/UG-SIDHARTH/portfolio](https://github.com/UG-SIDHARTH/portfolio)

---

# About The Portfolio

## Introduction

This portfolio is an interactive Web OS desktop interface built with vanilla HTML5, CSS3, JavaScript, and a lightweight Node.js Express backend. Spawning applications as draggable, focusable, minimizable, and maximizable windows, it delivers a high-fidelity developer brand.

### Included Applications

1. **Profile.app (About Me):** A general profile window detailing Sidharth's focus areas, biography, social hubs, and geolocation metadata (with phone number omitted).
2. **Skills.app (Skills Directory):** A categorized skills directory filtered dynamically via tab selections (Languages, IoT & Hardware, AI/ML, Design & Media).
3. **Projects.app (Showcase):** A grid card display highlighting the **Grabster / MediaHub Downloader** project.
4. **VS_Code.app (Interactive Code Editor):** A simulated file-viewer editor that mimics the VS Code coding environment. Users can toggle tabs to preview Sidharth's index.html, styles.css, script.js, or resume.json code snippets.
5. **Timeline.app (Education & Certs):** A glowing vertical academic path listing B.Tech CSE details and professional AI/ML analyst credentials.
6. **Terminal.app (Interactive Command Line):** A retro-futuristic interactive shell prompt. Visitors can input terminal queries to print resume contents.
7. **Mail.app (Contact Form):** A glassmorphic form handler triggering custom telemetry transmissions, communicating with the Express backend, and displaying validation toast alerts.

---

# Desktop & Shell Features

- **Draggable Window Manager:** Grab window header title bars to reposition apps. Active windows instantly re-focus on top via incremental `z-index` layering.
- **Min / Max / Close Controls:** Unix-style window dots trigger animated minimization to the dock, full-screen maximization, or closing.
- **Bottom Dock Launcher:** A glassmorphic application drawer highlighting active programs with neon cyan indicator dots. Includes a custom Start menu popover.
- **Live System Tray:** Shows localized seconds-accurate system clocks and random fluctuating telemetry statistics (representing fake hardware CPU usage).
- **Active Terminal Commands:**
  - `help`: Lists all console operations.
  - `neofetch`: Prints an ASCII system report detailing CPU, RAM emulation, and device resolution.
  - `about` / `profile`: Prints general biography copy.
  - `skills`: Lists programming languages, hardware systems, and data tools.
  - `projects`: Outlines featured engineering workloads (such as Grabster).
  - `timeline` / `education`: Lists academic milestones.
  - `contact` / `mail`: Displays email and geolocation info.
  - `clear`: Clears the shell output buffer.
  - `sudo [cmd]`: Prompts user password request with funny access-denied results.

---

# Technology Stack

- **Backend Server:** Node.js, Express.js framework, CORS middleware
- **Frontend UI:** HTML5 Semantic elements, CSS3 (Vanilla Variables & Keyframes), JavaScript (ES6 Canvas & Window listeners)
- **Storage:** Local server-side filesystem JSON ledger (`messages.json`)
- **Deployment:** Render / VPS / Docker / GitHub Pages
- **Design Tools:** Figma

---

# Getting Started (Local Development)

To run the Web OS portfolio locally with the Express server active:

1. Install Node.js on your computer (if not already installed).
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Boot the Express server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to:
   **[http://localhost:3000](http://localhost:3000)**

---

# Development Workflow

### Phase 1: OS Layout Scaffolding
- Coded window frameworks with mock titlebar control dots.
- Set up absolute-viewport layouts preventing body scrolling (`overflow: hidden; height: 100vh;`).
- Programmed bottom dock structures.

### Phase 2: Draggability and Window Logic
- Authored coordinate calculation loops mapping header `mousedown`/`touchstart` offsets to window positions.
- Coded the focal ordering (`z-index` tracking) and app state toggling (minimize / maximize transitions).

### Phase 3: App Systems & Interactivity
- Authored the terminal input parser loop mapping console keys.
- Implemented responsive grid overrides for tablet and mobile viewport screens.

---

# AI Usage

### AI Tools Used
- Gemini (Antigravity Agent)

### Contribution Split
- **Gemini:** Generated visual project cards, drafted layout templates, and wrote mathematical drag-and-drop boundary limits.
- **Sidharth D:** Designed visual aesthetics, structured text copy from resume, and adjusted layouts for responsive layouts.

---

# Testing & Debugging

- **Draggability Constraints:** Debugged title-bar coordinate maps to ensure windows do not slide off the top menu bar.
- **Mobile Fallbacks:** Replaced double-click listeners with fast-tap listeners for touchscreens.
- **Terminal Shell Validation:** Verified that command calls are filtered without throwing console errors.
