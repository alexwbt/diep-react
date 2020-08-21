import GameObject from ".";
import { CANNON_BALL } from "../constants";

export default class CannonBall extends GameObject {

    constructor(initInfo) {
        super({
            ...initInfo,
            objectType: CANNON_BALL
        });
        if (initInfo) {
            this.lifeTime = initInfo.lifeTime || 0;
            this.ownerId = initInfo.ownerId || 0;
        }
    }

    getInfo() {
        return super.getInfo().concat([
            this.lifeTime,
            this.ownerId
        ]);
    }

    setInfo(info) {
        let i = super.setInfo(info);
        this.lifeTime = info[i++];
        this.ownerId = info[i++];
        return i;
    }

    differentTeam(otherObject) {
        return super.differentTeam(otherObject)
            && this.ownerId !== otherObject.objectId
            && this.ownerId !== otherObject.ownerId;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.lifeTime -= deltaTime;
        if (this.lifeTime <= 0) {
            this.removed = true;
        }
    }

}
