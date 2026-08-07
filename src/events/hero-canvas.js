document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('mathCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    const getThemeColor = () => {
        const styles = getComputedStyle(document.documentElement);
        return styles.getPropertyValue('--secondary-color').trim() || '#4fd1c5';
    };

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resize);
    resize();

    let time = 0;
    const particles = [];

    // 1. Reduced the number of lines significantly for a cleaner look
    const numParticles = 300;

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(randomizeHistory = false) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.speed = Math.random() * 1.5 + 0.8;
            this.history = [];
            this.maxLength = Math.floor(Math.random() * 15) + 10;

            if (randomizeHistory) {
                for(let i = 0; i < this.maxLength; i++) {
                    this.history.push({x: this.x, y: this.y});
                }
            }
        }

        update() {
            // 2. The Cooler Equation: Interacting Eddies and Vortices
            const scaleA = 0.002;
            const scaleB = 0.003;
            const t = time * 0.08;

            // This creates distinct whirlpools by layering trigonometric functions
            const angle = (
                Math.sin(this.x * scaleA + t) * 2.5 +
                Math.cos(this.y * scaleB - t) * 1.5 +
                Math.sin((this.x + this.y) * 0.001)
            );

            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;

            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > this.maxLength) {
                this.history.shift();
            }

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            if (this.history.length < 2) return;

            ctx.beginPath();
            ctx.moveTo(this.history[0].x, this.history[0].y);

            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
            ctx.stroke();
        }
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const color = getThemeColor();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.2; // A bit more visible since there are fewer lines

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        time += 0.015;
        requestAnimationFrame(animate);
    }

    animate();
});