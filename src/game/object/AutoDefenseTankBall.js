import GameObject from ".";
import { AD_TANK_BALL } from "../constants";
import AutoDefenseTank from "./AutoDefenseTank";

export default class AutoDefenseTankBall extends GameObject {

    constructor() {
        super({
            radius: 5,
            color: '#aaccffff',
            borderWidth: 0.3,
            health: 1,
            maxHealth: 1,
            bodyDamage: 0,
            objectType: AD_TANK_BALL
        })
    }

    collide(otherObject, game) {
        super.collide(otherObject);
        if (this.removed && typeof otherObject.setWeapon === 'function') {
            game.spawn(new AutoDefenseTank({
                x: this.x,
                y: this.y
            }, otherObject));
        } else {
            this.removed = false;
            this.health = this.maxHealth;
        }
    }

    render(ctx, game) {
        super.render(ctx, game);

    }

}
