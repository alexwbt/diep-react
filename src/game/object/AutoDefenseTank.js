import Tank from "./Tank";
import { AD_TANK, defaultValue } from "../constants";
import { degree, different, radians } from "../maths";

export default class AutoDefenseTank extends Tank {

    constructor(initInfo, owner) {
        super({
            radius: 5,
            borderWidth: 0.3,
            health: 50,
            maxHealth: 50,
            color: '#aaccffff',
            team: owner.team,
            ...initInfo,
        });
        this.objectType = AD_TANK;
        this.owner = owner;
        this.ownerId = owner.objectId;
        if (initInfo) {
            this.targetRange = defaultValue(initInfo.targetRange, 150);
        }
    }

    update(deltaTime, game) {
        super.update(deltaTime, game);
        this.weapon.firing = !!this.target;

        const dif = different(this, this.owner);
        const dis = dif.x * dif.x + dif.y * dif.y;
        const range = this.radius * 4 + this.owner.radius * 4;
        if (dis > range * range) this.move(Math.atan2(dif.y, dif.x), deltaTime);
        else if (this.target) {
            this.rotate = degree(Math.atan2(this.target.y - this.y, this.target.x - this.x));
            this.move(radians(this.rotate), deltaTime);
            this.target = false;
        } else this.stop();
        if (!this.weapon.firing) this.rotate = this.owner.rotate;
    }

    differentTeam(otherObject) {
        return super.differentTeam(otherObject)
            && this.ownerId !== otherObject.objectId
            && this.ownerId !== otherObject.ownerId;
    }

    otherObjectUpdate(otherObject) {
        if (otherObject === this.owner ||
            !otherObject.weapon ||
            !this.differentTeam(otherObject) ||
            !otherObject.differentTeam(this))
            return;
        const dif = different(this, otherObject);
        const dis = dif.x * dif.x + dif.y * dif.y;
        const range = this.targetRange * this.targetRange;
        if (dis < range && (!this.target || dis < this.targetDis)) {
            this.target = otherObject;
            this.targetDis = dis;
        }
    }

}