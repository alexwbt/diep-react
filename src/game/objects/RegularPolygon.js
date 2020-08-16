import Object from '../object';

export default class RegularPolygon extends Object {

    constructor(info, vertices) {
        super(info);
        this.shape = 'regular-polygon';
        this.vertices = vertices;
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    render(ctx, game) {
        super.render(ctx, game);
    }

}
