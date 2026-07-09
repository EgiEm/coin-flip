# 🪙 The Golden Coin Flip

A premium, fully responsive **3D coin toss simulator** built entirely from scratch with **pure vanilla HTML5, CSS3, and JavaScript**. No external dependencies or audio assets required.

---

## 🚀 Key Features

* **🎲 Real-Time 3D Toss Physics**: Employs CSS 3D transforms (`rotateX`) mapped to dynamic time envelopes to simulate organic coin tumbling and flips.
* **🎵 Code-Synthesized Metallic Sound FX (Web Audio API)**:
  * Generates a rising-then-falling triangle oscillator wave to simulate the rapid "whirring" sound of a flipping coin.
  * Dynamically synthesizes a perfect-fifth harmony of sine waves on landing for a rich metallic "ping" (customized frequencies for Heads vs. Tails).
* **📊 Scoreboard Persistence**: Automatically records and tracks your session wins, losses, win-streaks, and ratios inside the browser's `localStorage`.
* **🎨 Glassmorphism & Cyber Aesthetic**: Dark-themed user interfaces with gold accents, custom SVG heads/tails emblems, and smooth interactive micro-animations.

---

## 🛠️ Technology Stack

* **Rendering Engine:** Vanilla HTML5 Canvas / CSS 3D Views
* **Audio Synthesizer:** Native Web Audio API
* **State Manager:** Browser LocalStorage API
* **Deployment:** Hosted directly on **GitHub Pages**

---

## 📁 Architecture & File Structure

```
coin-flip/
├── index.html   — Holds HUD markup, scoreboard tables, and SVG coin faces
├── style.css    — Custom variables, 3D coin perspective coordinates, animations
└── script.js    — Houses game loops, score state listeners, and dynamic Audio Synthesizers
```

### Sound Synthesis Design (from script.js):
```javascript
// Creates oscillator sweeps to simulate physical spinning
const osc = ctx.createOscillator();
osc.type = 'triangle';
osc.frequency.setValueAtTime(400, now);
osc.frequency.exponentialRampToValueAtTime(800, now + 0.10);
osc.frequency.exponentialRampToValueAtTime(300, now + 0.22);
```

---

## ⚙️ Setup & Execution

### Run Locally:
No builds or packages required. Simply:
1. Open the project root.
2. Open `index.html` directly in your browser, or run a simple local web server (e.g., Live Server extension in VS Code).

---

## 🚀 Live Demo
Play the game live at: **[egiem.github.io/coin-flip/](https://egiem.github.io/coin-flip/)**
