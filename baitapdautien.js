class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles(x, y, count = 100) {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8E72'];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 5 + Math.random() * 10;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                gravity: 0.15,
                friction: 0.99,
                rotation: Math.random() * Math.PI * 2,
                rotationVelocity: (Math.random() - 0.5) * 0.1,
                life: 1,
                decay: Math.random() * 0.015 + 0.005,
                shape: Math.random() > 0.5 ? 'circle' : 'square'
            });
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);

        this.particles.forEach(particle => {
            // Apply physics
            particle.vy += particle.gravity;
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Update rotation
            particle.rotation += particle.rotationVelocity;

            // Update life
            particle.life -= particle.decay;

            // Bounce off edges
            if (particle.x < 0) {
                particle.x = 0;
                particle.vx *= -0.5;
            }
            if (particle.x > this.canvas.width) {
                particle.x = this.canvas.width;
                particle.vx *= -0.5;
            }
            if (particle.y > this.canvas.height) {
                particle.y = this.canvas.height;
                particle.vy *= -0.3;
                particle.vx *= 0.8;
            }
        });
    }

    draw() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);

            if (particle.shape === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            }

            this.ctx.restore();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();
        this.draw();

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    burst(x, y, count = 150) {
        this.createParticles(x, y, count);
        this.animate();
    }
}