import { collision } from "./collisions";

export const createObjectInfo = info => ({
    x: 0,
    y: 0,
    radius: 10,
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

    ...info
});

export default class GameObject {

    constructor(info) {
        this.x = info.x;
        this.y = info.y;
        this.radius = info.radius;
        this.shape = info.shape;

        // render
        this.color = info.color;
        this.alpha = info.alpha;
        this.borderColor = info.borderColor;
        this.borderWidth = info.borderWidth;
        this.renderOnMap = info.renderOnMap;
        this.healthColor = info.healthColor;
        this.healthBarColor = info.healthBarColor;
        this.renderHealthBar = info.renderHealthBar;

        // game
        this.team = info.team;
        this.health = info.health;
        this.maxHealth = info.health;
        this.bodyDamage = info.bodyDamage;

        // movement
        this.forces = [];
        this.momentum = { x: 0, y: 0 };
    }

    onScreen(game) {
        const { x, y } = game.onScreen(this.x, this.y);
        const radius = this.radius * game.scale;
        return {
            x, y, radius, onScreen: collision({ shape: this.shape, x, y, radius }, {
                shape: 'AABB',
                a: { x: 0, y: 0 },
                b: { x: game.canvas.width, y: game.canvas.height }
            })
        };
    }

    update(deltaTime) {

    }

    render(ctx, game) {
        const { x, y, radius, onScreen } = this.onScreen(game);
        if (!onScreen) return;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = radius * this.borderWidth;
        ctx.beginPath();
        ctx.arc(x, y, radius * (1 - this.borderWidth / 2) + 0.5, 0, 2 * Math.PI);
        ctx.stroke();

        if (this.renderHealthBar && this.health !== this.maxHealth) {
            ctx.fillStyle = this.healthBarColor;
            ctx.fillRect(x - radius, y + radius * (1 + this.borderWidth / 2),
                radius * 2, radius * this.borderWidth);
            ctx.fillStyle = this.healthColor;
            ctx.fillRect(x - radius, y + radius * (1 + this.borderWidth / 2),
                radius * 2 * this.health / this.maxHealth, radius * this.borderWidth);
        }
    }

}
