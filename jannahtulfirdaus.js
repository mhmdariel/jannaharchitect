(function(){
    // Self-executing script: Infinite Jannatul Firdaus (Qur'an Arabic Symmetrical Model)
    // Works on existing WordPress pages – adds canvas and styles dynamically
    if (window.__JANNAH_FIRDAUS_ACTIVE__) return;
    window.__JANNAH_FIRDAUS_ACTIVE__ = true;

    // ---- CONFIGURATION ----
    const CONFIG = {
        particleCount: 77,
        symmetry: 4,
        arabicText: "جَنَّةُ الْفِرْدَوْسِ",
        divineNames: ["ٱلرَّحْمَـٰنِ", "ٱلرَّحِيمِ", "ٱلْمَلِكِ", "ٱلْقُدُّوسُ", "ٱلْجَبَّارُ", "ٱلْخَالِقُ", "ٱلْوَهَّابُ"]
    };

    let canvas, ctx, container, animationId, time = 0, width, height, centerX, centerY;
    let particles = [];
    let isActive = true;

    // ---- Helper functions ----
    function initParticles() {
        const p = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            p.push({
                x: Math.random(), y: Math.random(),
                radius: 2 + Math.random() * 6,
                speedX: (Math.random() - 0.5) * 0.004,
                speedY: (Math.random() - 0.5) * 0.004,
                phase: Math.random() * Math.PI * 2,
                colorHue: 45 + Math.random() * 25,
                glow: 0.5 + Math.random() * 0.8
            });
        }
        return p;
    }

    function drawBackground(ctx, w, h, t) {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "rgba(6,28,21,0.85)");
        grad.addColorStop(0.5, "rgba(18,48,38,0.88)");
        grad.addColorStop(1, "rgba(2,20,12,0.92)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.arc((w * 0.2 + (i * 97) % (w * 0.8)), (h * 0.3 + (i * 53) % (h * 0.6)), 35 + Math.sin(t * 0.5 + i) * 15, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(145,210,120,0.06)";
            ctx.fill();
        }
        ctx.save();
        ctx.globalAlpha = 0.24;
        ctx.beginPath();
        for (let step = 0; step < 8; step++) {
            const angleG = (step * Math.PI / 4) + t * 0.2;
            const x1 = centerX + Math.cos(angleG) * Math.min(w, h) * 0.42;
            const y1 = centerY + Math.sin(angleG) * Math.min(w, h) * 0.42;
            const x2 = centerX - Math.cos(angleG) * Math.min(w, h) * 0.42;
            const y2 = centerY - Math.sin(angleG) * Math.min(w, h) * 0.42;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "rgba(180,220,130,0.28)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawJannahGeometry(ctx, cx, cy, w, h, t) {
        const maxDim = Math.min(w, h);
        ctx.save();
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(210,180,80,0.5)";
        for (let layer = 1; layer <= 6; layer++) {
            const rad = (maxDim * 0.08) * layer + 6 * Math.sin(t * 0.9 + layer);
            ctx.beginPath();
            ctx.arc(cx, cy, rad, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(200,175,90,${0.25 + Math.sin(t + layer) * 0.1})`;
            ctx.lineWidth = 1.2 + Math.sin(t * 1.2 + layer) * 0.8;
            ctx.stroke();
            for (let petal = 0; petal < 8; petal++) {
                const anglePetal = petal * Math.PI / 4 + t * 0.5;
                const xOff = Math.cos(anglePetal) * rad;
                const yOff = Math.sin(anglePetal) * rad;
                ctx.beginPath();
                ctx.ellipse(cx + xOff, cy + yOff, rad * 0.2, rad * 0.35, anglePetal, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(240,205,110,0.18)";
                ctx.fill();
            }
        }
        ctx.beginPath();
        for (let r = -1; r <= 1; r++) {
            const yOffset = cy + Math.sin(t * 0.7) * 12 + r * 45;
            ctx.moveTo(0, yOffset);
            for (let x = 0; x <= w; x += 40) {
                const yWave = yOffset + Math.sin(x * 0.012 + t * 1.8) * 12;
                ctx.lineTo(x, yWave);
            }
            ctx.strokeStyle = "rgba(70,210,170,0.45)";
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawArabicSymmetry(ctx, cx, cy, t) {
        const fontSizeBase = Math.min(width, height) * 0.042;
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${fontSizeBase}px "Amiri", "Traditional Arabic", "Noto Naskh Arabic", serif`;
        const radiusRing = Math.min(width, height) * 0.26;
        for (let i = 0; i < 4; i++) {
            const angle = i * Math.PI / 2 + Math.sin(t * 0.8) * 0.05;
            const xRing = cx + Math.cos(angle) * radiusRing;
            const yRing = cy + Math.sin(angle) * radiusRing;
            ctx.save();
            ctx.translate(xRing, yRing);
            ctx.rotate(angle + Math.PI/2);
            ctx.fillStyle = `rgba(255,235,170,${0.7 + Math.sin(t * 1.5 + i) * 0.15})`;
            ctx.fillText(CONFIG.arabicText, 0, 0);
            ctx.restore();
        }
        ctx.font = `${fontSizeBase * 0.7}px "Amiri", serif`;
        for (let i = 0; i < 4; i++) {
            const angle = i * Math.PI / 2 + 0.35 * Math.sin(t);
            const rad = Math.min(width, height) * 0.14 + 8 * Math.sin(t * 2 + i);
            const xPos = cx + Math.cos(angle) * rad;
            const yPos = cy + Math.sin(angle) * rad;
            ctx.fillStyle = "rgba(210,190,130,0.85)";
            ctx.fillText("۞ جَنَّاتٌ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ ۞", xPos, yPos);
        }
        ctx.font = `bold ${fontSizeBase * 1.2}px "Amiri", serif`;
        ctx.fillStyle = "rgba(255,215,120,0.95)";
        ctx.fillText("ﷲ", cx, cy - 5);
        ctx.font = `${fontSizeBase * 0.58}px "Amiri", serif`;
        ctx.fillStyle = "rgba(255,230,150,0.9)";
        ctx.fillText("نُورُ ٱلسَّمَـٰوَٰتِ", cx, cy + fontSizeBase * 0.7);
        ctx.font = `${fontSizeBase * 0.45}px "Amiri", serif`;
        for (let a = 0; a < 8; a++) {
            const angleVerse = a * Math.PI / 4 + t * 0.3;
            const rVerse = Math.min(width, height) * 0.32;
            const xVerse = cx + Math.cos(angleVerse) * rVerse;
            const yVerse = cy + Math.sin(angleVerse) * rVerse;
            ctx.fillStyle = "rgba(255,205,100,0.7)";
            ctx.fillText(CONFIG.divineNames[a % CONFIG.divineNames.length], xVerse, yVerse);
        }
        ctx.restore();
    }

    function drawParticles(ctx, w, h, cx, cy, t, particlesArray) {
        for (let p of particlesArray) {
            const x = (p.x * w + Math.sin(t * 0.9 + p.phase) * 9) % w;
            const y = (p.y * h + Math.cos(t * 0.7 + p.phase * 1.3) * 7) % h;
            const dx = x - cx, dy = y - cy;
            for (let sym = 0; sym < 4; sym++) {
                const angleSym = sym * Math.PI / 2;
                const newX = cx + dx * Math.cos(angleSym) - dy * Math.sin(angleSym);
                const newY = cy + dx * Math.sin(angleSym) + dy * Math.cos(angleSym);
                if (newX > 0 && newX < w && newY > 0 && newY < h) {
                    const grad = ctx.createRadialGradient(newX, newY, 0, newX, newY, p.radius * 1.4);
                    grad.addColorStop(0, `hsla(${p.colorHue}, 85%, 65%, ${p.glow * 0.9})`);
                    grad.addColorStop(1, `hsla(${p.colorHue}, 90%, 55%, 0)`);
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(newX, newY, p.radius * 0.8 + 1.5 * Math.sin(t * 3 + p.phase), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = `rgba(255,210,100,0.7)`;
                    ctx.arc(newX, newY, p.radius * 0.4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    function renderFrame() {
        if (!ctx || !canvas || !isActive) return;
        if (!width || !height) {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            centerX = width/2;
            centerY = height/2;
        }
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            centerX = width/2;
            centerY = height/2;
        }
        time += 0.0027;
        const t = time;
        ctx.clearRect(0, 0, width, height);
        drawBackground(ctx, width, height, t);
        drawJannahGeometry(ctx, centerX, centerY, width, height, t);
        drawParticles(ctx, width, height, centerX, centerY, t, particles);
        drawArabicSymmetry(ctx, centerX, centerY, t);
        ctx.font = `italic ${Math.min(width, height) * 0.025}px "Amiri", serif`;
        ctx.fillStyle = "rgba(255,235,170,0.65)";
        ctx.shadowBlur = 5;
        ctx.fillText("﴿ وَٱلسَّـٰبِقُونَ ٱلسَّـٰبِقُونَ أُو۟لَـٰٓئِكَ ٱلْمُقَرَّبُونَ فِى جَنَّـٰتِ ٱلنَّعِيمِ ﴾", centerX, height - 28);
        ctx.fillText("جَنَّةُ الْفِرْدَوْسِ نُزُلًا – إِنَّهَا لَجَنَّةُ الْخُلْدِ", centerX, height - 12);
        animationId = requestAnimationFrame(renderFrame);
    }

    function setupCanvas() {
        if (document.querySelector('.jannah-canvas-container')) return;
        container = document.createElement('div');
        container.className = 'jannah-canvas-container';
        container.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999; overflow:hidden;';
        canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute; top:0; left:0; display:block; width:100%; height:100%; pointer-events:none;';
        canvas.id = 'jannahCanvas';
        container.appendChild(canvas);
        document.body.appendChild(container);
        ctx = canvas.getContext('2d');
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        centerX = width/2;
        centerY = height/2;
        particles = initParticles();
        window.addEventListener('resize', () => {
            if (!canvas) return;
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            centerX = width/2;
            centerY = height/2;
        });
        renderFrame();
    }

    function addToggleButton() {
        if (document.querySelector('.firdaus-toggle')) return;
        const btn = document.createElement('div');
        btn.className = 'firdaus-toggle';
        btn.innerHTML = '🌙 𓂀 ۞';
        btn.style.cssText = 'position:fixed; bottom:20px; right:20px; width:48px; height:48px; background:rgba(0,30,20,0.55); backdrop-filter:blur(8px); border-radius:60px; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10001; font-size:28px; border:1px solid rgba(255,215,120,0.5); box-shadow:0 0 12px rgba(255,200,100,0.3); color:#ffecb3; pointer-events:auto;';
        let visible = true;
        btn.onclick = () => {
            const cont = document.querySelector('.jannah-canvas-container');
            if (cont) {
                cont.style.transition = 'opacity 0.65s ease';
                cont.style.opacity = visible ? '0' : '1';
                visible = !visible;
            }
        };
        document.body.appendChild(btn);
    }

    function injectStyles() {
        if (document.getElementById('jannah-firdaus-styles')) return;
        const style = document.createElement('style');
        style.id = 'jannah-firdaus-styles';
        style.textContent = `
            .firdaus-toggle:hover { background: rgba(0,70,45,0.8); transform:scale(1.02); border-color:#ffd966; }
            .firdaus-toggle::after { content:"✨ جنّة الفردوس ✨"; position:absolute; bottom:55px; right:0; background:rgba(0,0,0,0.7); font-size:12px; padding:6px 12px; border-radius:28px; white-space:nowrap; font-family:'Amiri','Traditional Arabic',serif; color:#ffefb9; opacity:0; transition:opacity 0.2s; pointer-events:none; direction:rtl; }
            .firdaus-toggle:hover::after { opacity:1; }
            @media (max-width:640px) { .firdaus-toggle { width:40px; height:40px; font-size:22px; } .firdaus-toggle::after { font-size:10px; content:"🌿 جنّة"; } }
        `;
        document.head.appendChild(style);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectStyles();
            setupCanvas();
            addToggleButton();
        });
    } else {
        injectStyles();
        setupCanvas();
        addToggleButton();
    }
})();
