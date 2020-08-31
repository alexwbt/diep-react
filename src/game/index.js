import { collision, circleInCircle } from './collisions';
import { CANNON_BALL, GAME_OBJECT, HEAL_BALL, REGULAR_POLYGON, TANK, WEAPON_BALL, SHIELD_BALL, BUSH, AD_TANK, AD_TANK_BALL } from './constants';
import MiniMap from './huds/minimap';
import { degree, different } from './maths';
import GameObject from './object';
import CannonBall from './object/CannonBall';
import HealBall from './object/HealBall';
import RegularPolygon from './object/RegularPolygon';
import ShieldBall from './object/ShieldBall';
import Tank from './object/Tank';
import WeaponBall from './object/WeaponBall';
import Bush from './object/Bush';
import AutoDefenseTank from './object/AutoDefenseTank';
import AutoDefenseTankBall from './object/AutoDefenseTankBall';

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
        this.minBorderRadius = 100;
        this.borderRadius = 2000;
        this.borderSpeed = 0.05;

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
        this.beforeControl = {};
        this.playerRotate = [];

        // minimap
        this.minimap = new MiniMap(this);

        this.startTime = Date.now();
        this.interval = setInterval(() => {
            const now = Date.now();
            const deltaTime = (now - this.startTime) / 1000;
            this.startTime = now;
            if (this.canvas) {
                this.update(deltaTime, this);
                this.render();
            }
        }, 1000 / 60);
    }

    init() {
        const player = new Tank({ x: 10, weaponType: 'twinCannon' });
        player.objectId = 1;
        this.playerId = 1;
        this.objects = [];
        this.spawn(player);
        this.spawnBalls();
        this.spawnObstacles();
        this.spawnBushes();
    }

    setData(data) {
        const createObject = type => {
            switch (type) {
                default:
                case GAME_OBJECT: return new GameObject();
                case REGULAR_POLYGON: return new RegularPolygon();
                case CANNON_BALL: return new CannonBall();
                case WEAPON_BALL: return new WeaponBall();
                case HEAL_BALL: return new HealBall();
                case SHIELD_BALL: return new ShieldBall();
                case TANK: return new Tank();
                case BUSH: return new Bush();
                case AD_TANK: return new Tank();
                case AD_TANK_BALL: return new GameObject();
            }
        };
        this.borderRadius = data.br;
        if (data.min) {
            this.objects = this.objects.filter(o => {
                if (o.objectId === 0) return false;
                let hasData = false;
                data.objects = data.objects.filter(d => {
                    if (d[0] === o.objectId) {
                        hasData = d;
                        return false;
                    }
                    return true;
                });
                if (hasData)
                    o.setData(hasData);
                if (o.objectId === this.playerId)
                    o.rotate = this.control.rotate || 0;
                return !!hasData;
            });
            if (data.objects.length > 0 && this.socket) {
                this.socket.emit('initialUpdate');
            }
        } else {
            // this.objects = this.objects.filter(o => {
            //     if (o.objectId === 0) return false;
            //     let hasData = false;
            //     data.objects = data.objects.filter(d => {
            //         if (d[0] === o.objectId) {
            //             hasData = d;
            //             return false;
            //         }
            //         return true;
            //     });
            //     if (hasData)
            //         o.setInfo(hasData);
            //     if (o.objectId === this.playerId)
            //         o.rotate = this.control.rotate || 0;
            //     return !!hasData;
            // });
            // data.objects.forEach(data => {
            //     const object = createObject(data[6]);
            //     object.setInfo(data);
            //     if (object.objectId === this.playerId)
            //         object.rotate = this.control.rotate || 0;
            //     this.objects.push(object);
            // });
            this.objects = data.objects.map(objectData => {
                const object = createObject(objectData[6]);
                object.setInfo(objectData);
                if (object.objectId === this.playerId)
                    object.rotate = this.control.rotate || 0;
                return object;
            });
            this.particles = data.particles.map(objectData => {
                const object = createObject(objectData[6]);
                object.setInfo(objectData);
                return object;
            });
        }
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
            this.player.weapon.firing = fire;
            this.control.firing = fire;
        }
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
     * @param {number} [minRange] - Minimum range of random location.
     */
    spawn(object, randomLocation, range, minRange = 0) {
        if (!range) range = this.borderRadius - object.radius - 10;
        if (randomLocation) {
            const randomDirection = Math.random() * Math.PI * 2;
            const randomRange = Math.random() * (range - minRange) + minRange;
            object.x = Math.cos(randomDirection) * randomRange;
            object.y = Math.sin(randomDirection) * randomRange;
        }
        this.spawnList.push(object);
        return object.objectId;
    }

    spawnParticle(particle, randomLocation, range, minRange = 0, fadeOverTime = true) {
        if (!range) range = this.borderRadius - particle.radius - 10;
        if (randomLocation) {
            const randomDirection = Math.random() * Math.PI * 2;
            const randomRange = Math.random() * (range - minRange) + minRange;
            particle.x = Math.cos(randomDirection) * randomRange;
            particle.y = Math.sin(randomDirection) * randomRange;
        }
        particle.renderHealthBar = false;
        particle.alpha = 1;
        particle.fadeOverTime = fadeOverTime;
        this.particles.push(particle);
    }

    /**
     * Spawns obstacles.
     * @param {number} [count] - Number of obstacle.
     * @param {{min: number, max: number}} [vertices] - Range of random vertices.
     * @param {{min: number, max: number}} [radius] - Range of random radius.
     */
    spawnObstacles(count = 50, vertices = { min: 3, max: 5 }, radius = { min: 5, max: 20 }) {
        const colors = ['#dd8800ff', '#ffff99ff', '#0066ffff'];
        for (let i = 0; i < count; i++) {
            const randomRadius = Math.random() * (radius.max - radius.min) + radius.min;
            const randomVertices = Math.round(Math.random() * (vertices.max - vertices.min) + vertices.min);
            this.spawn(new RegularPolygon({
                vertices: randomVertices,
                radius: randomRadius,
                color: colors[randomVertices % colors.length],
                team: -1,
                health: randomRadius * 5,
                maxHealth: randomRadius * 5
            }), true);
        }
    }

    /**
     * Spawns balls.
     * @param {number} [count] - Number of balls.
     */
    spawnBalls(count = 20) {
        for (let i = 0; i < count; i++)
            this.spawn(new WeaponBall(), true);
        for (let i = 0; i < count; i++)
            this.spawn(new HealBall(), true);
        for (let i = 0; i < count; i++)
            this.spawn(new ShieldBall(), true);
        for (let i = 0; i < count; i++)
            this.spawn(new AutoDefenseTankBall(), true);
    }

    spawnBushes(count = 20) {
        for (let i = 0; i < count; i++)
            this.spawnParticle(new Bush(), true, false, 0, false);
    }

    update(deltaTime) {
        // update particles
        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime, this);
            if (particle.fadeOverTime) particle.alpha -= deltaTime * 20;
            return particle.alpha > 0;
        });

        // update objects
        this.objects = this.objects.concat(this.spawnList);
        this.spawnList = [];
        this.objects = this.objects.filter(object => {
            if (this.playerId !== 0 && object.objectId === this.playerId && object.objectType === TANK) {
                this.player = object;
                this.focus = object;
                if (this.view > 700) this.view = 500;
            } else {
                let hasRotate = false;
                this.playerRotate = this.playerRotate.filter(r => {
                    if (r[0] === object.objectId) hasRotate = r[1];
                    return hasRotate !== false;
                });
                if (hasRotate !== false) object.rotate = hasRotate;
            }
            object.update(deltaTime, this);
            // border
            if (!circleInCircle(object, { x: 0, y: 0, radius: this.borderRadius })) {
                switch (object.objectType) {
                    case TANK:
                        object.health -= this.minBorderRadius / this.borderRadius;
                        if (object.health <= 0) object.removed = true;
                        break;
                    default:
                        const dir = Math.atan2(-object.y, -object.x);
                        object.addForce({ x: Math.cos(dir) * 500, y: Math.sin(dir) * 500 });
                        object.removed = true;
                }
            }
            // collision
            this.objects.forEach(otherObject => {
                if (otherObject === object) return;
                if (collision(object.getShape(), otherObject.getShape()))
                    object.collide(otherObject, this);
                if (typeof object.otherObjectUpdate === 'function')
                    object.otherObjectUpdate(otherObject);
            });
            if (object.removed)
                this.spawnParticle(object);
            return !object.removed;
        });

        // update input
        if (this.playerId === 0) {
            this.player = false;
            this.focus = false;
        }

        const input = { x: 0, y: 0 };
        for (let i = 0; i < this.keyMap.length; i++) {
            if (this.keyDown[i]) {
                input.x += this.keyMap[i].x;
                input.y += this.keyMap[i].y;
            }
        }

        if (this.player) {
            this.control.moving = input.x !== 0 || input.y !== 0;
            if (this.control.moving) {
                this.control.movingDirection = Math.atan2(input.y, input.x);
                this.player.move(this.control.movingDirection, deltaTime);
            } else this.player.stop();

            if ((this.control.firing !== this.beforeControl.firing
                || this.control.rotate !== this.beforeControl.rotate
                || this.control.moving !== this.beforeControl.moving
                || this.control.movingDirection !== this.beforeControl.movingDirection) && this.socket) {
                this.beforeControl.firing = this.control.firing;
                this.beforeControl.rotate = this.control.rotate;
                this.beforeControl.moving = this.control.moving;
                this.beforeControl.movingDirection = this.control.movingDirection;
                this.socket.emit('update', this.control);
            }
        }
        if (this.focus) {
            this.camera.x = this.focus.x;
            this.camera.y = this.focus.y;
        } else {
            this.camera.x += input.x * 5;
            this.camera.y += input.y * 5;
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

        // render border
        this.ctx.fillStyle = 'rgba(200, 100, 100, 0.5)';
        this.ctx.beginPath();
        const { x, y } = this.onScreen(0, 0);
        const borderRadius = this.borderRadius * this.scale;
        this.ctx.rect(0, 0, W, H);
        this.ctx.arc(x, y, borderRadius, 0, Math.PI * 2, true);
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgb(200, 100, 100)';
        this.ctx.lineWidth = 10 * this.scale;
        this.ctx.beginPath();
        this.ctx.arc(x, y, borderRadius, 0, Math.PI * 2);
        this.ctx.stroke();

        this.minimap.render(this.ctx);
    }

}
