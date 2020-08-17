import GameObject from '.';
import { radians } from '../maths';

export default class RegularPolygon extends GameObject {

    /**
     * RegularPolygon Constructor
     * @param {*} info - Object info.
     * @param {number} vertices - Number of vertices.
     */
    constructor(info, vertices) {
        super(info);
        this.shape = 'polygon';
        this.vertices = vertices;
    }

    getData() {
        return {
            ...super.getData(),
            shape: 'polygon',
            vertices: this.vertices,
            objectType: 'RegularPolygon'
        };
    }

    setData(data) {
        super.setData(data);
        this.shape = 'polygon';
        this.vertices = data.vertices;
    }

    getVertices(game, radiusMultiply = 1) {
        const vertices = [];
        for (let i = 0; i < this.vertices; i++) {
            const dir = Math.PI * 2 / this.vertices * i + radians(this.rotate);
            const x = this.x + Math.cos(dir) * this.radius * radiusMultiply;
            const y = this.y + Math.sin(dir) * this.radius * radiusMultiply;
            vertices.push(game ? game.onScreen(x, y) : { x, y });
        }
        return vertices;
    }

    onScreen(game) {
        return {
            ...super.onScreen(game),
            vertices: this.getVertices(game)
        };
    }

    render(ctx, game) {
        const { x, y, radius, onScreen, vertices } = this.onScreen(game);
        if (!onScreen) return;
        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++)
            ctx.lineTo(vertices[i].x, vertices[i].y);
        ctx.closePath();
        ctx.fill();

        const borderVertices = this.getVertices(game, 1 - this.borderWidth / 2);
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.radius * this.borderWidth * game.scale;
        ctx.beginPath();
        ctx.moveTo(borderVertices[0].x, borderVertices[0].y);
        for (let i = 1; i < borderVertices.length; i++)
            ctx.lineTo(borderVertices[i].x, borderVertices[i].y);
        ctx.closePath();
        ctx.stroke();

        this.healthBarRender(ctx, x, y, radius);
        ctx.globalAlpha = 1;
    }

}
