// Sound Synthesizer Class using Web Audio API
class CoinSoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setEnabled(isEnabled) {
        this.enabled = isEnabled;
        if (isEnabled) {
            this.init();
        }
    }

    playFlip() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Create oscillator for the main coin tone
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        
        // Pitch sweep to simulate the spinning sound (rapid pitch modulation)
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.10);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.22);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.48);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.62);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.75);

        // Create filter for a warmer metallic sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(5, now);
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(1000, now + 0.35);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.75);

        // Gain node for envelope
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        
        // Fast flutter effect representing the spins
        for (let i = 0.05; i < 0.75; i += 0.08) {
            gain.gain.setValueAtTime(0.25, now + i);
            gain.gain.exponentialRampToValueAtTime(0.08, now + i + 0.04);
        }
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        // Connect nodes
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.8);
    }

    playLanding(isHeads) {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // High pitched ringing oscillators for metallic "ping"
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        
        osc1.type = 'sine';
        osc2.type = 'sine';

        // Set frequencies for metallic harmony
        const baseFreq = isHeads ? 987.77 : 880; // B5 for Heads, A5 for Tails
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // Perfect fifth harmony

        // Master gain node
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.1, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        // Connect nodes
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        
        osc1.stop(now + 0.8);
        osc2.stop(now + 0.8);
    }
}

// Game Controller Setup
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const coin = document.getElementById('coin-element');
    const coinWrapper = document.getElementById('coin-wrapper');
    const flipBtn = document.getElementById('flip-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultText = document.getElementById('result-text');
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    
    // Stats elements
    const statTotal = document.getElementById('stat-total');
    const statHeads = document.getElementById('stat-heads');
    const statHeadsPct = document.getElementById('stat-heads-pct');
    const statTails = document.getElementById('stat-tails');
    const statTailsPct = document.getElementById('stat-tails-pct');

    // Instantiation
    const soundFX = new CoinSoundFX();
    let isSpinning = false;
    let currentRotation = 0;
    
    // Load Stats from LocalStorage or initialize
    let stats = JSON.parse(localStorage.getItem('coinFlipStats')) || {
        total: 0,
        heads: 0,
        tails: 0
    };

    // Update the UI stats displays
    function updateStatsUI() {
        statTotal.textContent = stats.total;
        statHeads.textContent = stats.heads;
        statTails.textContent = stats.tails;

        const headsPercent = stats.total > 0 ? Math.round((stats.heads / stats.total) * 100) : 0;
        const tailsPercent = stats.total > 0 ? Math.round((stats.tails / stats.total) * 100) : 0;

        statHeadsPct.textContent = `${headsPercent}%`;
        statTailsPct.textContent = `${tailsPercent}%`;
    }

    // Save stats to LocalStorage
    function saveStats() {
        localStorage.setItem('coinFlipStats', JSON.stringify(stats));
    }

    // Flip implementation
    function flipCoin() {
        if (isSpinning) return;
        
        isSpinning = true;
        flipBtn.disabled = true;
        resultText.classList.remove('pop');
        resultText.textContent = "Flipping...";

        // Initialize Audio context on first user click if needed
        soundFX.init();
        soundFX.playFlip();

        // 50/50 randomized outcome
        const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
        
        // Spin calculation (using rotateX for vertical spin)
        const isCurrentlyHeads = (currentRotation / 180) % 2 === 0;
        let targetRotation = currentRotation + 1440; // 4 full spins base
        
        if (outcome === 'heads') {
            if (!isCurrentlyHeads) {
                targetRotation += 180; // Align to heads (multiple of 360)
            }
        } else {
            if (isCurrentlyHeads) {
                targetRotation += 180; // Align to tails (odd multiple of 180)
            }
        }
        
        currentRotation = targetRotation;

        // Apply visual rotation CSS variables and classes
        coin.style.setProperty('--coin-rotation', `${currentRotation}deg`);
        coin.classList.add('spinning');
        coinWrapper.classList.add('tossing');

        // Handle animation end
        setTimeout(() => {
            // Remove spinning & tossing styles to restore standard state behaviors (like hover scaling)
            coin.classList.remove('spinning');
            coinWrapper.classList.remove('tossing');

            // Update result text
            const formattedResult = outcome.charAt(0).toUpperCase() + outcome.slice(1);
            resultText.textContent = formattedResult;
            resultText.classList.add('pop');

            // Sound landing
            soundFX.playLanding(outcome === 'heads');

            // Update stats
            stats.total++;
            if (outcome === 'heads') {
                stats.heads++;
            } else {
                stats.tails++;
            }
            
            saveStats();
            updateStatsUI();

            // Re-enable flip interactions
            isSpinning = false;
            flipBtn.disabled = false;
        }, 800); // Must align with the transition & animation duration (0.8s)
    }

    // Keyboard support: Space/Enter on coin element
    coin.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flipCoin();
        }
    });

    // Touch & Click Event Listeners
    coin.addEventListener('click', flipCoin);
    flipBtn.addEventListener('click', flipCoin);

    // Reset stats functionality
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all stats?')) {
            stats = { total: 0, heads: 0, tails: 0 };
            saveStats();
            updateStatsUI();
            
            // Subtle reset feedback
            resultText.textContent = "Stats Reset!";
            resultText.classList.remove('pop');
            setTimeout(() => {
                if (resultText.textContent === "Stats Reset!") {
                    resultText.textContent = "Click to Flip!";
                }
            }, 1500);
        }
    });

    // Sound toggle listener
    soundToggle.addEventListener('change', () => {
        const isEnabled = soundToggle.checked;
        soundFX.setEnabled(isEnabled);
        soundIcon.textContent = isEnabled ? '🔊' : '🔇';
    });

    // Initial setup
    updateStatsUI();
    soundFX.setEnabled(soundToggle.checked);
});
