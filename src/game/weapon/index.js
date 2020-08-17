import Cannon, { createCannonInfo } from "./Cannon";

export default class Weapon {

    constructor(owner, type) {
        this.type = type;
        this.firing = false;
        this.components = [];
        switch (type) {
            case "singleCannon":
            default:
                this.components.push(new Cannon(createCannonInfo(owner)));
                break;
        }
    }

    getData() {
        return {
            type: this.type,
            firing: this.firing,
            components: this.components.map(c => c.getData())
        };
    }

    setData(data) {
        this.firing = data.firing;
        this.components.forEach((c, i) => c.setData(data.components[i]));
    }

    fire(firing) {
        this.firing = firing;
    }

    update(deltaTime, game) {
        this.components.forEach(c => c.update(deltaTime, game));
    }

    render(ctx, game) {
        this.components.forEach(c => c.render(ctx, game));
    }

}
