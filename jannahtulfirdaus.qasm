(function() {
    // ============================================================
    //  Arabic QASM (Oath) - قسم عربي:
    //  وَالْفَجْرِ وَاللَّيَالِي الْعَشْرِ وَالشَّفْعِ وَالْوَتْرِ
    //  أُقْسِمُ بِاللَّهِ أَنْ أَنْشُرَ جَنَّةَ الْفِرْدَوْسِ الَّتِي لَا تَنَاهِي لَهَا
    //  فِي كُلِّ مَكَانٍ، وَهَذَا الْقَسَمُ مُتَجَسِّدٌ فِي هَذِهِ الشَّفْرَةِ.
    // ============================================================

    // Prevent duplicate canvas injection
    if (document.getElementById('firdaus-canvas')) return;

    // Ensure DOM is ready before injecting the canvas overlay
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function() {
        // --- 1. Create fixed canvas overlay (non-intrusive, pointer-events: none) ---
        const canvas = document.createElement('canvas');
        canvas.id = 'firdaus-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';   // users can click through
        canvas.style.zIndex = '999999';
        canvas.style.display = 'block';
        document.body.appendChild(canvas);

        let ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationId = null;
        let growingInterval = null;

        // --- 2. Paradise particle settings ---
        const INITIAL_PARTICLE_COUNT = 150;
        const MAX_PARTICLE_COUNT = 450;       // "infinite" but performance safe
        const GROWTH_STEP = 8;                // particles added every few seconds
        const GROWTH_INTERVAL_MS = 9000;      // add new particles every 9 seconds
        const BASE_SPEED = 0.35;
        const RANDOM_SPEED_VAR = 0.28;

        // Arabic text: Jannatul Firdaus in beautiful calligraphic style
        const PARADISE_PHRASE = "جَنَّةُ الْفِرْدَوْسِ";
        const SECONDARY_PHRASE = "فِرْدَوْسٌ لَا يَنْقَطِعُ";  // "Firdaus never ends"
        const PHRASES = [PARADISE_PHRASE, SECONDARY_PHRASE];

        // Colors inspired by paradise (gold, green, light of jannah)
        const COLORS = [
            "#FFD966", // soft gold
            "#F4C542", // rich gold
            "#6A9C78", // serene green
            "#7CB342", // lively green
            "#D4AF37", // metallic gold
            "#C5E1A5", // pale paradise green
            "#FFF2B5"  // heavenly glow
        ];

        // --- 3. Particle class definition ---
        class ParadiseParticle {
            constructor(x, y, vx, vy, fontSize, color, text, opacity) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.fontSize = fontSize;
                this.color = color;
                this.text = text;
                this.opacity = opacity;
            }

            draw(context) {
                context.save();
                context.shadowBlur = 8;
                context.shadowColor = "rgba(255, 215, 0, 0.6)";
                context.font = `500 ${this.fontSize}px 'Segoe UI', 'Traditional Arabic', 'Noto Sans Arabic', 'Arial', sans-serif`;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.globalAlpha = this.opacity;
                context.fillStyle = this.color;
                context.fillText(this.text, this.x, this.y);
                // subtle light reflection
                context.shadowBlur = 3;
                context.fillStyle = "rgba(255, 250, 210, 0.4)";
                context.fillText(this.text, this.x - 1, this.y - 1);
                context.restore();
            }

            update(canvasW, canvasH) {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce with slight energy loss (smooth floating)
                if (this.x < 15) {
                    this.x = 15;
                    this.vx = -this.vx * 0.98;
                }
                if (this.x > canvasW - 15) {
                    this.x = canvasW - 15;
                    this.vx = -this.vx * 0.98;
                }
                if (this.y < 20) {
                    this.y = 20;
                    this.vy = -this.vy * 0.98;
                }
                if (this.y > canvasH - 20) {
                    this.y = canvasH - 20;
                    this.vy = -this.vy * 0.98;
                }

                // occasional tiny random drift (wind of jannah)
                if (Math.random() < 0.02) {
                    this.vx += (Math.random() - 0.5) * 0.12;
                    this.vy += (Math.random() - 0.5) * 0.12;
                    // limit speed
                    const maxSpeed = 1.8;
                    this.vx = Math.min(maxSpeed, Math.max(-maxSpeed, this.vx));
                    this.vy = Math.min(maxSpeed, Math.max(-maxSpeed, this.vy));
                }
            }
        }

        // --- 4. Helper: generate random particle ---
        function createRandomParticle(canvasW, canvasH) {
            const x = Math.random() * (canvasW - 40) + 20;
            const y = Math.random() * (canvasH - 40) + 20;
            const vx = (Math.random() - 0.5) * BASE_SPEED * 1.4;
            const vy = (Math.random() - 0.5) * BASE_SPEED * 1.4;
            const fontSize = Math.floor(Math.random() * 20 + 18); // 18-38px
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const text = PHRASES[Math.floor(Math.random() * PHRASES.length)];
            const opacity = Math.random() * 0.4 + 0.55; // 0.55 - 0.95
            return new ParadiseParticle(x, y, vx, vy, fontSize, color, text, opacity);
        }

        // --- 5. Resize handler: update canvas dimensions & adjust particle positions ---
        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            if (ctx) {
                ctx = canvas.getContext('2d');
            }
            // Reposition particles that went outside due to new dimensions
            if (particles.length) {
                particles.forEach(p => {
                    p.x = Math.min(width - 20, Math.max(20, p.x));
                    p.y = Math.min(height - 20, Math.max(20, p.y));
                });
            }
        }

        // --- 6. Increase particles dynamically (infinite expansion of paradise) ---
        function increaseParadiseParticles() {
            if (particles.length >= MAX_PARTICLE_COUNT) return;
            let toAdd = GROWTH_STEP;
            if (particles.length + toAdd > MAX_PARTICLE_COUNT) {
                toAdd = MAX_PARTICLE_COUNT - particles.length;
            }
            for (let i = 0; i < toAdd; i++) {
                particles.push(createRandomParticle(width, height));
            }
            // optional console blessing (non intrusive)
            if (particles.length === MAX_PARTICLE_COUNT) {
                // reaches blessed cap - still infinite movement
                if (growingInterval) clearInterval(growingInterval);
            }
        }

        // --- 7. Animation loop: infinite moving particles of Jannah ---
        function animate() {
            if (!ctx || !canvas.isConnected) return;
            ctx.clearRect(0, 0, width, height);
            // draw each particle (paradise text)
            for (let p of particles) {
                p.update(width, height);
                p.draw(ctx);
            }
            animationId = requestAnimationFrame(animate);
        }

        // --- 8. Initialize particle system & start infinite paradise deployment ---
        function initParadise() {
            resizeCanvas();
            // populate initial particles (infinite seeds of firdaus)
            for (let i = 0; i < INITIAL_PARTICLE_COUNT; i++) {
                particles.push(createRandomParticle(width, height));
            }
            // start animation
            animate();
            // schedule growth of paradise over time (infinite expansion)
            growingInterval = setInterval(() => {
                increaseParadiseParticles();
            }, GROWTH_INTERVAL_MS);
            // resize listener
            window.addEventListener('resize', () => {
                resizeCanvas();
            });
        }

        // --- 9. Graceful cleanup (avoid memory leaks, optional) ---
        function destroyParadise() {
            if (animationId) cancelAnimationFrame(animationId);
            if (growingInterval) clearInterval(growingInterval);
            window.removeEventListener('resize', resizeCanvas);
            if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }

        // edge-case: if body gets replaced (some WordPress themes), but we keep safe
        if (document.body) {
            initParadise();
        } else {
            const observer = new MutationObserver(() => {
                if (document.body && !document.getElementById('firdaus-canvas')) {
                    observer.disconnect();
                    initParadise();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }

        // Optional: expose a hidden global method to remove paradise if needed (not mandatory)
        window.__removeFirdausParadise = destroyParadise;
    });
})();
