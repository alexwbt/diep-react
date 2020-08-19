import { collision } from './collisions';
import MiniMap from './huds/minimap';
import { degree, different } from './maths';
import GameObject from './object';
import CannonBall from './object/CannonBall';
import RegularPolygon from './object/RegularPolygon';
import Tank from './object/Tank';
import WeaponBall from './object/WeaponBall';

export default class Game {

    constructor() {
        // render
        this.backgroundColor = 'white';
        this.gridColor = 'lightgrey';
        this.gridWidth = 1;
        this.gridSize = 10;

        // game
        this.spawnList = [];
        this.objects = [];
        this.particles = [];

        // camera
        this.scale = 1;
        this.view = 500;
        this.camera = { x: 0, y: 0 };
        this.cameraSpeed = 1;

        // control
        this.keyMap = [
            { x: 0, y: -1 }, // w
            { x: -1, y: 0 }, // a
            { x: 0, y: 1 },  // s
            { x: 1, y: 0 }   // d
        ];
        this.keyDown = [];
        this.control = {};

        // minimap
        this.minimap = new MiniMap(this);

        this.running = true;
        this.startTime = Date.now();
        this.loop();
    }

    loop = () => {
        const now = Date.now();
        const deltaTime = (now - this.startTime) / 1000;
        this.startTime = now;
        if (this.canvas) {
            this.update(deltaTime, this);
            this.render();
        }
        this.running && window.requestAnimationFrame(this.loop);
    };

    setData(data) {
        const createObject = type => {
            switch (type) {
                default:
                case 'GameObject': return new GameObject();
                case 'RegularPolygon': return new RegularPolygon();
                case 'CannonBall': return new CannonBall();
                case 'Tank': return new Tank();
                case 'WeaponBall': return new WeaponBall();
            }
        };
        this.spawnList = [];
        this.objects = data.objects.map(objectData => {
            const object = createObject(objectData.objectType);
            object.setData(objectData);
            if (object.objectId === this.playerId) {
                object.rotate = this.control.rotate || 0;
            }
            return object;
        });
        this.particles = data.particles.map(objectData => {
            const object = createObject(objectData.objectType);
            object.setData(objectData);
            return object;
        });
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    setKeyDown(keyDown) {
        this.keyDown = keyDown;
    }

    setMouse({ x, y }) {
        if (this.player) {
            const mouse = this.inGame(x, y);
            const diff = different(this.player, mouse);
            this.control.rotate = degree(Math.atan2(diff.y, diff.x));
            this.player.rotate = this.control.rotate;
        }
    }

    fire(fire) {
        if (this.player) {
            this.player.weapon.fire(fire);
            this.control.firing = fire;
        }
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

    /**
     * Spawns an object.
     * @param {*} object 
     * @param {boolean} [randomLocation] - Spawn in random location.
     * @param {number} [range] - Range of random location.
     */
    spawn(object, randomLocation, range = 1000) {
        if (randomLocation) {
            object.x = Math.random() * range - range / 2;
            object.y = Math.random() * range - range / 2;
        }
        this.spawnList.push(object);
    }

    spawnParticle(particle) {
        particle.renderHealthBar = false;
        particle.alpha = 1;
        this.particles.push(particle);
    }

    /**
     * Spawns obstacles.
     * @param {number} [count] - Number of obstacle.
     * @param {{min: number, max: number}} [vertices] - Range of random vertices.
     * @param {{min: number, max: number}} [radius] - Range of random radius.
     */
    spawnObstacles(count = 50, vertices = { min: 3, max: 5 }, radius = { min: 5, max: 20 }) {
        const colors = ['orange', '#FF9', '#06f'];
        for (let i = 0; i < count; i++) {
            const randomRadius = Math.random() * (radius.max - radius.min) + radius.min;
            const randomVertices = Math.round(Math.random() * (vertices.max - vertices.min) + vertices.min);
            this.spawn(new RegularPolygon({
                radius: randomRadius,
                color: colors[randomVertices % colors.length],
                team: 'obstacle',
                health: randomRadius * 5,
                maxHealth: randomRadius * 5
            }, randomVertices), true);
        }
    }

    /**
     * Spawns weapon balls.
     * @param {number} [count] - Number of weapon ball.
     */
    spawnWeaponBalls(count = 20) {
        for (let i = 0; i < count; i++)
            this.spawn(new WeaponBall(), true);
    }

    update(deltaTime) {
        // update particles
        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime, this);
            particle.alpha -= deltaTime * 20;
            return particle.alpha > 0;
        });

        // update objects
        this.objects = this.objects.concat(this.spawnList);
        this.spawnList = [];
        this.objects = this.objects.filter(object => {
            if (object.objectId === this.playerId && object instanceof Tank) {
                this.player = object;
                this.focus = object;
            }
            object.update(deltaTime, this);
            this.objects.forEach(otherObject => {
                if (otherObject !== object && collision(object, otherObject))
                    object.collide(otherObject);
            });
            if (object.removed)
                this.spawnParticle(object);
            return !object.removed;
        });

        // update input
        if (this.player) {
            const input = { x: 0, y: 0 };
            for (let i = 0; i < this.keyDown.length; i++) {
                if (this.keyDown[i]) {
                    input.x += this.keyMap[i].x;
                    input.y += this.keyMap[i].y;
                }
            }
            this.control.moving = input.x !== 0 || input.y !== 0;
            if (this.control.moving) {
                this.control.movingDirection = Math.atan2(input.y, input.x);
                this.player.move(this.control.movingDirection, deltaTime);
            } else this.player.stop();

            if (this.socket) {
                this.socket.emit('update', this.control);
            }
        }

        // update camera
        if (this.focus) {
            this.camera.x = this.focus.x;
            this.camera.y = this.focus.y;
        }
        this.scale = Math.max(this.canvas.width, this.canvas.height) / this.view;
    }

    render() {
        // update canvas size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // render background
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, W, H);

        // render grid
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

        // render objects and particles
        this.objects.forEach(object => object.render(this.ctx, this));
        this.particles.forEach(particle => particle.render(this.ctx, this));

        this.minimap.render(this.ctx);
    }

}
