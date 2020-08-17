import { collision } from "../collisions";
import { pythagorean, radians } from "../maths";
import { createObjectInfo } from "../object";
import CannonBall from "../object/CannonBall";

export const createCannonInfo = (owner, info) => ({
    owner,
    x: 0,
    y: 0,
    width: 0.8,
    length: 1.5,
    rotate: 0,
    delay: 0,
    recoil: 0.1,
    reloadSpeed: 1,

    // bullet
    bulletSpeed: 1,
    bulletDamage: 1,
    bulletPenetration: 1,
    range: 2,

    ...info
});

export default class Cannon {

    constructor(info) {
        this.owner = info.owner;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.length = info.length;
        this.rotate = info.rotate;
        this.delay = info.delay;
        this.recoil = info.recoil;
        this.reloadSpeed = info.reloadSpeed;

        // bullet
        this.bulletSpeed = info.bulletSpeed;
        this.bulletDamage = info.bulletDamage;
        this.bulletPenetration = info.bulletPenetration;
        this.range = info.range;

        this.type = "polygon";
        this.color = "#aaa";
        this.reloadCounter = 0;
    }
    
    getData() {
        return this.reloadCounter;
    }

    setData(data) {
        this.reloadCounter = data;
    }

    getVertices(game, mod = 0) {
        const rotate = radians(this.owner.rotate) + this.rotate;
        const reloadProgress = 1 - this.reloadCounter / (this.reloadSpeed * this.owner.reloadSpeed);
        const length = this.length * (1 - this.recoil + Math.min(1, reloadProgress) * this.recoil);

        const vertices = [
            { x: this.x + mod, y: this.y - this.width / 2 + mod },
            { x: this.x + length - mod, y: this.y - this.width / 2 + mod },
            { x: this.x + length - mod, y: this.y + this.width / 2 - mod },
            { x: this.x + mod, y: this.y + this.width / 2 - mod }
        ];

        for (let i = 0; i < vertices.length; i++) {
            const dir = Math.atan2(vertices[i].y, vertices[i].x) + rotate;
            const mag = pythagorean(vertices[i].x, vertices[i].y);
            const x = this.owner.x + Math.cos(dir) * this.owner.radius * mag;
            const y = this.owner.y + Math.sin(dir) * this.owner.radius * mag;
            vertices[i] = game ? game.onScreen(x, y) : { x, y };
        }
        return vertices;
    }

    onScreen(game) {
        const vertices = this.getVertices(game);
        const a = { x: vertices[0].x, y: vertices[0].y };
        const b = { x: vertices[0].x, y: vertices[0].y };
        vertices.forEach(vertex => {
            a.x = Math.min(a.x, vertex.x);
            a.y = Math.min(a.y, vertex.y);
            b.x = Math.max(a.x, vertex.x);
            b.y = Math.max(a.y, vertex.y);
        });
        return {
            vertices: this.getVertices(game),
            onScreen: collision({ shape: 'AABB', a, b }, {
                shape: 'AABB',
                a: { x: 0, y: 0 },
                b: { x: game.canvas.width, y: game.canvas.height }
            })
        };
    }

    update(deltaTime, game) {
        if (this.reloadCounter > 0)
            this.reloadCounter -= deltaTime;
        else if (this.owner.weapon.firing) {
            const x = (this.x + this.length) * this.owner.radius;
            const y = this.y * this.owner.radius;
            const dir = Math.atan2(y, x) + radians(this.owner.rotate) + radians(this.rotate);
            const mag = pythagorean(x, y);
            game.spawn(new CannonBall(createObjectInfo({
                x: this.owner.x + Math.cos(dir) * mag,
                y: this.owner.y + Math.sin(dir) * mag,
                radius: this.owner.radius * this.width / 2,
                color: 'red',
                borderWidth: 0.5,
                renderHealthBar: false,
                renderOnMap: false,
                team: this.owner.team,
                health: this.owner.bulletPenetration * this.bulletPenetration,
                bodyDamage: this.owner.bulletDamage * this.bulletDamage,
                movingDirection: radians(this.owner.rotate) + this.rotate,
                movingSpeed: this.bulletSpeed * this.owner.bulletSpeed,
                lifeTime: this.range
            })));

            this.reloadCounter = this.reloadSpeed * this.owner.reloadSpeed + this.delay;
        }
    }

    render(ctx, game) {
        const { vertices, onScreen } = this.onScreen(game);
        if (!onScreen) return;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++)
            ctx.lineTo(vertices[i].x, vertices[i].y);
        ctx.closePath();
        ctx.fill();

        const borderVertices = this.getVertices(game, this.owner.borderWidth / 2);
        ctx.strokeStyle = this.owner.borderColor;
        ctx.lineWidth = this.owner.radius * game.scale * this.owner.borderWidth;
        ctx.beginPath();
        ctx.moveTo(borderVertices[0].x, borderVertices[0].y);
        for (let i = 1; i < borderVertices.length; i++)
            ctx.lineTo(borderVertices[i].x, borderVertices[i].y);
        ctx.closePath();
        ctx.stroke();
    }

}
