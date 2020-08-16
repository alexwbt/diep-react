import { radian } from "./maths";

export default class Game {

    constructor() {
        // render
        this.backgroundColor = 'white';
        this.gridColor = 'lightgrey';
        this.gridWidth = 1;
        this.gridSize = 10;

        // game
        this.objects = [];
        this.particles = [];

        // camera
        this.scale = 1;
        this.camera = { x: 0, y: 0 };
        this.cameraSpeed = 1;

        // control
        this.inputDirections = [];

        this.running = true;
        this.startTime = Date.now();
        this.loop();
    }

    loop = () => {
        const now = Date.now();
        const deltaTime = (now - this.startTime) / 1000;
        this.update(deltaTime);
        this.canvas && this.render();
        this.running && window.requestAnimationFrame(this.loop);
    };

    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    stop() {
        this.running = false;
    }

    /**
     * Converts in-game coordinate to screen coordinate.
     * @param {number} x 
     * @param {number} y 
     */
    onScreen(x, y) {
        return {
            x: (x - this.camera.x) * this.scale + this.canvas.width / 2,
            y: (y - this.camera.y) * this.scale + this.canvas.height / 2
        };
    }

    /**
     * Converts screen coordinate to in-game coordinate.
     * @param {number} x 
     * @param {number} y 
     */
    inGame(x, y) {
        return {
            x: (x - this.canvas.width / 2) / this.scale + this.camera.x,
            y: (y - this.canvas.height / 2) / this.scale + this.camera.y
        };
    }

    spawn(object) {
        this.objects.push(object);
    }

    spawnParticle(particle) {
        particle.isParticle = true;
        this.particles.push(particle);
    }

    update(deltaTime) {
        // update objects
        this.objects = this.objects.filter(object => {
            object.update(deltaTime);
            return !object.removed;
        });

        // update particles
        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime);
            return particle.isParticle;
        });

        // update input
        const direction = this.inputDirections.reduce((a, dir) => {
            const r = radian(dir);
            a.x += Math.cos(r);
            a.y += Math.sin(r);
        }, { x: 0, y: 0 });

        // update camera
        if (this.player) {
            this.camera.x = this.player.x;
            this.camera.y = this.player.y;
        } else {

        }
    }

    render() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const W = this.canvas.width;
        const H = this.canvas.height;

        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, W, H);

        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = this.gridWidth * this.scale;
        const gridSize = this.gridSize * this.scale;
        const os = this.onScreen(0, 0);
        for (let x = os.x % gridSize; x < W; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, H);
            this.ctx.stroke();
        }
        for (let y = os.y % gridSize; y < H; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(W, y);
            this.ctx.stroke();
        }

        this.objects.forEach(object => object.render(this.ctx, this));
        this.particles.forEach(particle => particle.render(this.ctx, this));
    }

}
