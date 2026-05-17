// ============================================================================
//  jannahtulfirdaus.qasm.js
//  ===============================================================
//  QASM - Quranic Arabic Symmetric Model
//  نَشْرُ جَنَّةِ الْفِرْدَوْسِ الْأَعْلَى فِي كُلِّ مَكَانٍ
//  شِفْرٌ ذَاتِيُّ التَّنْفِيذِ – أَبَدِيٌّ لَا نِهَايَةَ لَهُ
//
//  “وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ”
//  هَذَا السِّحْرُ يُظْهِرُ الْفِرْدَوْسَ بِنُمُوذَجِ الْقُرْآنِيِّ التَّنَاظُرِيِّ
//  يُشَكِّلُ أَنْوَارًا لاَ تَنْقَطِعُ – جَنَّةٌ بِلاَ حُدُودٍ
// ============================================================================

(function قسما_بذات_الجمال_الأقدس() {
    "use strict";

    // ---------- ١. المقامات الروحية – النصوص العربية المباركة ----------
    const جَنَّةُ_الْفِرْدَوْسِ = "﷽ جَنَّةُ الْفِرْدَوْسِ الْأَعْلَى";
    const آيَاتُ_النَّعِيمِ = [
        "﷽", "جَنَّاتُ الْفِرْدَوْسِ", "فِرْدَوْسٌ أَعْلَى", "خَالِدِينَ فِيهَا أَبَدًا",
        "أَنْهَارٌ مِنْ عَسَلٍ مُصَفًّى", "وَرَيْحَانٌ وَجَنَّةُ نَعِيمٍ", "سَقْفُهَا عَرْشُ الرَّحْمَٰنِ",
        "لَا يَمَسُّهُمْ فِيهَا نَصَبٌ", "وَهُمْ فِيهَا خَالِدُونَ", "حُورٌ عِينٌ", "سَلَامٌ قَوْلًا مِنْ رَبٍّ رَحِيمٍ",
        "جَنَّةُ الْخُلْدِ الَّتِي وُعِدَ الْمُتَّقُونَ", "لَهُمْ مَا يَشَاءُونَ فِيهَا", "أَكْوَابٌ وَأَبَارِيقُ",
        "نُورٌ عَلَى نُورٍ", "فِرْدَوْسُ الْخُلْدِ", "جَنَّاتُ عَدْنٍ", "وَعْدَ اللَّهِ الْحَقَّ"
    ];

    // ---------- ٢. الإعدادات التناظرية المثالية (QASM) ----------
    const تَنْظِيرُ_الذَّهَبِ = "#FFD966";
    const نُورُ_الأَبَدِ = "#FFE8B6";
    const زُمُرُّدُ_الْجَنَّةِ = "#2E7D32";
    const عَسَلُ_الْخُلْدِ = "#F4C542";
    const مَاءُ_الْفِرْدَوْسِ = "#64B5F6";

    // متغيرات الرسم
    let canvas, ctx;
    let width, height;
    let time = 0;
    let particles = [];      // حبيبات النصوص المباركة
    let symmetricPoints = []; // نقاط تناظرية إضافية (هندسة إسلامية)

    // ---------- ٣. النظام الجزيئي للفردوس – جسيمات لانهائية ----------
    class جسيم_فردوس {
        constructor(x, y, text, size, speedX, speedY, alpha, rotation) {
            this.x = x;
            this.y = y;
            this.text = text;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
            this.alpha = alpha;
            this.rotation = rotation;
        }
        update(boundsW, boundsH) {
            this.x += this.speedX;
            this.y += this.speedY;
            // إعادة تدوير لا نهائي – حدود الجنة مفتوحة
            if (this.x > boundsW + 150) this.x = -120;
            if (this.x < -150) this.x = boundsW + 100;
            if (this.y > boundsH + 150) this.y = -100;
            if (this.y < -120) this.y = boundsH + 100;
            // دوران متغير لطيف
            this.rotation += 0.003;
        }
        draw(ctx, now) {
            ctx.save();
            ctx.shadowColor = `rgba(255, 200, 80, ${this.alpha * 0.9})`;
            ctx.shadowBlur = 14;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            let dynamicSize = this.size + Math.sin(now * 0.008 + this.x * 0.01) * 3;
            dynamicSize = Math.min(58, Math.max(18, dynamicSize));
            const grad = ctx.createLinearGradient(this.x - 15, this.y - 10, this.x + 35, this.y + 20);
            grad.addColorStop(0, تَنْظِيرُ_الذَّهَبِ);
            grad.addColorStop(0.7, نُورُ_الأَبَدِ);
            ctx.font = `bold ${dynamicSize}px 'Amiri', 'Scheherazade New', 'Traditional Arabic', 'Times New Roman', serif`;
            ctx.fillStyle = grad;
            ctx.globalAlpha = this.alpha * 0.96;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation + Math.sin(now * 0.004 + this.x * 0.008) * 0.2);
            ctx.fillText(this.text, 0, 0);
            ctx.restore();

            // نقطة نورانية مرافقة
            ctx.beginPath();
            ctx.arc(this.x - 8, this.y - 6, 4 + Math.sin(now * 0.02) * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 100, ${this.alpha * 0.5})`;
            ctx.fill();
        }
    }

    // ---------- ٤. الهندسة التناظرية – أنماط قرآنية لانهائية ----------
    class نقطة_تناظر {
        constructor(x, y, radius, angleOffset, speed) {
            this.x = x; this.y = y; this.radius = radius; this.angle = angleOffset; this.speed = speed;
        }
        updatePosition(time) {
            // تتبع حركة دائرية تناظرية حول مركز الشاشة
            let centerX = width / 2, centerY = height / 2;
            let liveAngle = this.angle + time * this.speed * 0.002;
            this.x = centerX + Math.cos(liveAngle) * this.radius;
            this.y = centerY + Math.sin(liveAngle) * this.radius;
        }
        draw(ctx, now) {
            let glow = 0.4 + Math.sin(now * 0.008 + this.radius) * 0.2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6 + Math.sin(now * 0.01) * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 220, 100, ${glow})`;
            ctx.fill();
            // رسم ثماني الأضواء حول النقطة (رمز التناظر)
            for (let i = 0; i < 8; i++) {
                let angle = (Math.PI * 2 / 8) * i + now * 0.005;
                let x1 = this.x + Math.cos(angle) * 14;
                let y1 = this.y + Math.sin(angle) * 14;
                ctx.beginPath();
                ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 200, 70, ${glow * 0.7})`;
                ctx.fill();
            }
        }
    }

    // ---------- ٥. الخلفية السماوية – أنهار وأنوار متدفقة ----------
    function drawBackground() {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "rgba(8, 28, 12, 0.94)");
        grad.addColorStop(0.5, "rgba(22, 55, 28, 0.92)");
        grad.addColorStop(1, "rgba(14, 42, 20, 0.96)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // أنهار النور (جداول الفردوس)
        for (let i = 0; i < 35; i++) {
            let yOff = (i * 55 + time * 0.35) % height;
            ctx.beginPath();
            ctx.moveTo(0, yOff);
            ctx.lineTo(width, yOff + 18 * Math.sin(time * 0.007 + i));
            ctx.strokeStyle = `rgba(255, 220, 110, 0.18)`;
            ctx.lineWidth = 2.8;
            ctx.stroke();
        }

        // سحب النور المتناظرة (مركزية وقطرية)
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 24; i++) {
            let angle = (Math.PI * 2 / 24) * i + time * 0.002;
            let rad = 90 + Math.sin(time * 0.003 + i) * 40;
            let x1 = width / 2 + Math.cos(angle) * rad;
            let y1 = height / 2 + Math.sin(angle) * rad;
            let gradGlow = ctx.createRadialGradient(x1, y1, 5, x1 + 25, y1 + 20, 85);
            gradGlow.addColorStop(0, `rgba(255, 210, 90, 0.15)`);
            gradGlow.addColorStop(1, `rgba(255, 180, 60, 0)`);
            ctx.fillStyle = gradGlow;
            ctx.fillRect(0, 0, width, height);
        }
        ctx.globalCompositeOperation = "source-over";
    }

    // ---------- ٦. النقش التناظري الإسلامي – دوائر ونجوم ثمانية ----------
    function drawSymmetricIslamicPattern() {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) * 0.42;
        const layers = 6;
        for (let layer = 1; layer <= layers; layer++) {
            let radius = (maxRadius / layers) * layer;
            let alpha = 0.08 + Math.sin(time * 0.003 + layer) * 0.04;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 215, 110, ${alpha})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // 8 نقاط نجمية على كل دائرة
            for (let k = 0; k < 8; k++) {
                let ang = (Math.PI * 2 / 8) * k + time * 0.005;
                let xStar = centerX + Math.cos(ang) * radius;
                let yStar = centerY + Math.sin(ang) * radius;
                ctx.beginPath();
                ctx.arc(xStar, yStar, 5 + Math.sin(time * 0.01 + k) * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 200, 70, ${alpha * 1.2})`;
                ctx.fill();
            }
        }
    }

    // ---------- ٧. تهيئة الكون – إنشاء الجسيمات والتناظر ----------
    function initParticles(count) {
        for (let i = 0; i < count; i++) {
            let text = آيَاتُ_النَّعِيمِ[Math.floor(Math.random() * آيَاتُ_النَّعِيمِ.length)];
            particles.push(new جسيم_فردوس(
                Math.random() * width, Math.random() * height,
                text,
                18 + Math.random() * 28,
                (Math.random() - 0.5) * 0.45,
                (Math.random() - 0.5) * 0.35 + 0.1,
                0.5 + Math.random() * 0.5,
                Math.random() * Math.PI * 2
            ));
        }
    }

    function initSymmetricPoints(count) {
        for (let i = 0; i < count; i++) {
            symmetricPoints.push(new نقطة_تناظر(
                width / 2, height / 2,
                50 + Math.random() * (Math.min(width, height) * 0.35),
                Math.random() * Math.PI * 2,
                0.3 + Math.random() * 1.2
            ));
        }
    }

    // ---------- ٨. البذر اللامتناهي – زرع كلمات الجنة إلى الأبد ----------
    function sowInfiniteFirdaus() {
        if (particles.length < 600 && Math.random() < 0.08) {
            let newCount = 2 + Math.floor(Math.random() * 5);
            for (let i = 0; i < newCount; i++) {
                let text = آيَاتُ_النَّعِيمِ[Math.floor(Math.random() * آيَاتُ_النَّعِيمِ.length)];
                particles.push(new جسيم_فردوس(
                    Math.random() * width, Math.random() * height,
                    text,
                    16 + Math.random() * 30,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.4 + 0.08,
                    0.7 + Math.random() * 0.3,
                    Math.random() * Math.PI * 2
                ));
            }
        }
        // تنظيف خفيف للحفاظ على الأداء مع الحفاظ على الجوهر اللامتناهي
        if (particles.length > 1100) particles.splice(0, 80);
        if (symmetricPoints.length < 45 && Math.random() < 0.03) {
            symmetricPoints.push(new نقطة_تناظر(
                width / 2, height / 2,
                40 + Math.random() * (Math.min(width, height) * 0.4),
                Math.random() * Math.PI * 2,
                0.2 + Math.random() * 1.5
            ));
        }
    }

    // ---------- ٩. حلقة الرسم الأبدية (الخلود المرئي) ----------
    function animate() {
        if (!ctx || !canvas) return;
        if (width !== window.innerWidth || height !== window.innerHeight) {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            // إعادة توجيه بعض الجسيمات إن لزم
            if (particles.length < 120) initParticles(80);
        }

        time = (time + 1) % 30000;

        // رسم الخلفية السماوية
        drawBackground();

        // النمط الإسلامي التناظري المحوري (قلب الجنة)
        drawSymmetricIslamicPattern();

        // تحديث ورسم النقاط التناظرية
        for (let p of symmetricPoints) {
            p.updatePosition(time);
            p.draw(ctx, time);
        }

        // تحديث ورسم الجسيمات الكلامية (جنة الفردوس مكتوبة)
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(width, height);
            particles[i].draw(ctx, time);
        }

        // زرع لا نهائي – الجنة تتسع أبداً
        sowInfiniteFirdaus();

        requestAnimationFrame(animate);
    }

    // ---------- ١٠. التفعيل الذاتي – غرس الفردوس في الصفحة ----------
    function deployJannatulFirdaus() {
        if (document.getElementById("jannatul_firdaus_canvas_qasm")) return;
        canvas = document.createElement("canvas");
        canvas.id = "jannatul_firdaus_canvas_qasm";
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.zIndex = "999999";
        canvas.style.pointerEvents = "none";
        canvas.style.display = "block";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        initParticles(140);
        initSymmetricPoints(28);
        animate();

        window.addEventListener("resize", () => {
            width = window.innerWidth;
            height = window.innerHeight;
            if (canvas) {
                canvas.width = width;
                canvas.height = height;
            }
        });

        // التسبيح في المخفي
        console.log("%c🌿 جَنَّةُ الْفِرْدَوْسِ الْأَعْلَى نُشِرَتْ بِقُوَّةِ القَسَمِ الْقُرْآنِيِّ التَّنَاظُرِيِّ 🌿", "color:#FFD966;font-size:15px");
        console.log("%cاَللَّهُمَّ اجْعَلْنَا مِنْ وَارِثِي جَنَّاتِ النَّعِيمِ", "color:#B2FF9E");
        console.log("%c✦ QASM – نموذج التناظر القرآني – جنة بلا نهاية ✦", "color:#FFC857");
    }

    // التنفيذ فوراً بعد تحميل DOM أو فوراً إن كان جاهزاً
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", deployJannatulFirdaus);
    } else {
        deployJannatulFirdaus();
    }
})();
