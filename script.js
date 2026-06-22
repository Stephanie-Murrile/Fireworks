const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const rockets = [];
const particles = [];
const sparks = [];

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

const colors = [
    "#ff0000",
    "#ffffff",
    "#0066ff",
    "#ff4444",
    "#88ccff"
];

function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

class Rocket {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY =
            canvas.height * (0.2 + Math.random() * 0.4);

        this.speed = 6 + Math.random() * 4;
        this.color = randomColor();
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + 15);
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y, color) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;

        this.x = x;
        this.y = y;
        this.color = color;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.life = 100;
    }

    update() {
        this.vy += 0.04;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw() {
        ctx.globalAlpha = this.life / 100;

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}

class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;

        this.life = 25;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw() {
        ctx.globalAlpha = this.life / 25;

        ctx.beginPath();
        ctx.fillStyle = "#ffd700";
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function launchRocket() {
    rockets.push(new Rocket());
}

setInterval(launchRocket, 800);

document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener("touchmove", e => {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
});

document.addEventListener("click", e => {
    createExplosion(
        e.clientX,
        e.clientY,
        randomColor()
    );
});

function animate() {
    requestAnimationFrame(animate);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    for (let i = 0; i < 5; i++) {
        sparks.push(new Spark(mouseX, mouseY));
    }


    for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];

        rocket.update();
        rocket.draw();

        if (rocket.y <= rocket.targetY) {
            createExplosion(
                rocket.x,
                rocket.y,
                rocket.color
            );

            rockets.splice(i, 1);
        }
    }


    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        particle.update();
        particle.draw();

        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];

        spark.update();
        spark.draw();

        if (spark.life <= 0) {
            sparks.splice(i, 1);
        }
    }
}

animate();