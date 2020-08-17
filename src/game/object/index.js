import { collision } from "../collisions";
import { different } from "../maths";

export const createObjectInfo = info => ({
    x: 0,
    y: 0,
    radius: 10,
    rotate: 0,
    shape: 'circle',

    // render
    color: '#0af',
    alpha: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 0.1,
    renderOnMap: true,
    healthColor: 'rgba(0, 255, 0, 0.5)',
    healthBarColor: 'rgba(0, 0, 0, 0.5)',
    renderHealthBar: true,

    // game
    team: 'self',
    health: 100,
    maxHealth: 100,
    bodyDamage: 1,

    // movement
    movingDirection: 0,
    movingSpeed: 0,
    forces: [],
    momentum: { x: 0, y: 0 },
    friction: 5,

    ...info
});

export default class GameObject {

    constructor(info) {
        this.setData(info);
    }

    getData() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
            rotate: this.rotate,
            shape: this.shape,

            // render
            color: this.color,
            alpha: this.alpha,
            borderColor: this.borderColor,
            borderWidth: this.borderWidth,
            renderOnMap: this.renderOnMap,
            healthColor: this.healthColor,
            healthBarColor: this.healthBarColor,
            renderHealthBar: this.renderHealthBar,

            // game
            team: this.team,
            health: this.health,
            maxHealth: this.maxHealth,
            bodyDamage: this.bodyDamage,

            // movement
            forces: this.forces,
            momentum: this.momentum,
            friction: this.friction,
            objectType: 'Object'
        };
    }

    setData(data) {
        this.x = data.x;
        this.y = data.y;
        this.radius = data.radius;
        this.rotate = data.rotate;
        this.shape = data.shape;

        // render
        this.color = data.color;
        this.alpha = data.alpha;
        this.borderColor = data.borderColor;
        this.borderWidth = data.borderWidth;
        this.renderOnMap = data.renderOnMap;
        this.healthColor = data.healthColor;
        this.healthBarColor = data.healthBarColor;
        this.renderHealthBar = data.renderHealthBar;

        // game
        this.team = data.team;
        this.health = data.health;
        this.maxHealth = data.health;
        this.bodyDamage = data.bodyDamage;

        // movement
        this.movingDirection = data.movingDirection;
        this.movingSpeed = data.movingSpeed;
        this.forces = data.forces;
        this.momentum = data.momentum;
        this.friction = data.friction;
    }

    onScreen(game) {
        const { x, y } = game.onScreen(this.x, this.y);
        const radius = this.radius * game.scale;
        return {
            x, y, radius, onScreen: collision({ shape: 'circle', x, y, radius }, {
                shape: 'AABB',
                a: { x: 0, y: 0 },
                b: { x: game.canvas.width, y: game.canvas.height }
            })
        };
    }

    /**
     * Add a force to the object.
     * @param {{x: number, y: number}} force 
     */
    addForce(force) {
        this.forces.push(force);
    }

    differentTeam(otherObject) {
        return this.team !== otherObject.team || this.team === 'self';
    }

    collide(otherObject) {
        const dif = different(otherObject, this);
        this.addForce({
            x: dif.x,
            y: dif.y
        });

        if (this.differentTeam(otherObject) && otherObject.differentTeam(this)) {
            this.health -= otherObject.bodyDamage;
            if (this.health <= 0) this.removed = true;
            else this.alpha = 0.5;
        }
    }

    update(deltaTime) {
        this.forces.forEach(force => {
            this.momentum.x += force.x;
            this.momentum.y += force.y;
        });
        this.forces = [];
        this.x += this.momentum.x * deltaTime;
        this.y += this.momentum.y * deltaTime;
        if (Math.abs(this.momentum.x) < 0.001) this.momentum.x = 0;
        else this.momentum.x *= Math.pow(Math.E, -this.friction * deltaTime);
        if (Math.abs(this.momentum.y) < 0.001) this.momentum.y = 0;
        else this.momentum.y *= Math.pow(Math.E, -this.friction * deltaTime);

        this.x += Math.cos(this.movingDirection) * this.movingSpeed * deltaTime;
        this.y += Math.sin(this.movingDirection) * this.movingSpeed * deltaTime;

        if (this.alpha < 1) this.alpha += deltaTime * 10;
        else this.alpha = 1;
    }

    render(ctx, game) {
        const { x, y, radius, onScreen } = this.onScreen(game);
        if (!onScreen) return;
        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = radius * this.borderWidth;
        ctx.beginPath();
        ctx.arc(x, y, radius * (1 - this.borderWidth / 2) + 0.5, 0, 2 * Math.PI);
        ctx.stroke();

        this.healthBarRender(ctx, x, y, radius);
        ctx.globalAlpha = 1;
    }

    healthBarRender(ctx, x, y, radius) {
        if (this.renderHealthBar && this.health !== this.maxHealth) {
            ctx.fillStyle = this.healthBarColor;
            ctx.fillRect(x - radius, y + radius * 1.2, radius * 2, 8);
            ctx.fillStyle = this.healthColor;
            ctx.fillRect(x - radius, y + radius * 1.2, radius * 2 * this.health / this.maxHealth, 8);
        }
    }

    onMap(map) {
        const { x, y } = map.onMap(this.x, this.y);
        const radius = this.radius * map.scale;
        return {
            x, y, radius,
            onMap: collision({ shape: 'circle', x, y, radius }, { shape: 'circle', x: map.x, y: map.y, radius: map.radius })
        };
    }

    mapRender(ctx, map) {
        const { x, y, radius, onMap } = this.onMap(map);
        if (!onMap) return;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

}
