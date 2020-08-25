import { radians } from "../maths";

export default class MiniMap {

    constructor(game) {
        this.game = game;
        this.radius = 150;
        this.x = this.radius + this.radius / 5;
        this.y = this.radius + this.radius / 5;
        this.scale = this.radius / this.game.view;

        this.backgroundColor = '#eee';
        this.borderColor = '#555';
        this.alpha = 0.9;
    }

    onMap(x, y) {
        return {
            x: (x - this.game.camera.x) * this.scale + this.x,
            y: (y - this.game.camera.y) * this.scale + this.y
        }
    }

    render(ctx) {
        ctx.globalAlpha = this.alpha;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.clip();

        ctx.fillStyle = this.backgroundColor;
        ctx.fill();

        ctx.globalAlpha = 1;

        // render objects
        this.game.objects.forEach(object => object.renderOnMap && object.mapRender(ctx, this));

        // render border
        ctx.fillStyle = 'rgba(200, 100, 100, 0.3)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        const { x, y } = this.onMap(0, 0);
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.arc(x, y, this.game.borderRadius * this.scale, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

        ctx.lineWidth = 3;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();

        ctx.lineWidth = 1;
        for (let i = 0; i < 360; i += 5) {
            const d = radians(i);
            ctx.beginPath();
            ctx.moveTo(this.x + Math.cos(d) * this.radius, this.y + Math.sin(d) * this.radius);
            ctx.lineTo(this.x + Math.cos(d) * this.radius * 0.95, this.y + Math.sin(d) * this.radius * 0.95);
            ctx.stroke();
        }
    }

}
