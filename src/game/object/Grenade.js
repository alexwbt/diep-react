import GameObject from ".";
import { GRENADE } from "../constants";

const grenades = {
    default: {
        color: '#F6BD05ff',
        timer: 3,
        explode: () => { }
    },
    black: {
        color: '#444444ff',
        timer: 2,
        explode: () => { }
    }
};

export default class Grenade extends GameObject {

    constructor(initInfo, type = 'default', owner) {
        super({
            radius: 5,
            color: grenades[type].color,
            health: !!owner ? 50 : 1,
            maxHealth: !!owner ? 50 : 1,
            bodyDamage: 0,
            borderWidth: 0.3,
            ...initInfo,
            team: !!owner ? owner.team : undefined,
            objectType: GRENADE
        });
        if (owner) this.ownerId = owner.objectId;
        this.owner = owner;
        this.timer = grenades[type].timer;
        this.thrown = !!owner;
        this.type = type;
    }

    getInfo() {
        return super.getInfo().concat([
            this.timer,
            this.thrown
        ]);
    }

    setInfo(info) {
        let i = super.setInfo(info);
        this.timer = info[i++];
        this.thrown = info[i++];
        return i;
    }

    update(deltaTime, game) {
        super.update(deltaTime);
        if (this.thrown) {
            this.timer -= deltaTime;
            if (this.timer <= 0 && !this.removed)
                this.explode(game);
        }
    }

    explode(game) {
        this.exploded = true;
        this.removed = true;
        grenades[this.type].explode(game, this);
    }

    collide(otherObject) {
        super.collide(otherObject);
        if (this.thrown) return;
        if (this.removed && typeof otherObject.setWeapon === 'function' && otherObject.name && !otherObject.grenade)
            otherObject.grenade = this.type;
        else {
            this.removed = false;
            this.health = this.maxHealth;
        }
    }

    render(ctx, game) {
        const { x, y, radius, onScreen } = super.render(ctx, game);
        if (!onScreen) return;

        ctx.globalAlpha = this.alpha;
        ctx.lineWidth = radius * this.borderWidth;
        ctx.strokeStyle = this.thrown && Math.floor(this.timer * 5) % 2 === 0 ? 'red' : 'black';
        ctx.beginPath();
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

}
