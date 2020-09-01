import GameObject from ".";
import { CANNON_BALL, defaultValue } from "../constants";

export default class CannonBall extends GameObject {

    constructor(initInfo) {
        super({
            ...initInfo,
            renderHealthBar: false,
            objectType: CANNON_BALL
        });
        if (initInfo) {
            this.lifeTime = defaultValue(initInfo.lifeTime, 0);
            this.ownerId = defaultValue(initInfo.ownerId, 0);
            this.ownerName = defaultValue(initInfo.ownerName, '');
        }
    }

    getInfo() {
        return super.getInfo().concat([
            this.lifeTime,
        ]);
    }

    setInfo(info) {
        let i = super.setInfo(info);
        this.lifeTime = info[i++];
        return i;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.lifeTime -= deltaTime;
        if (this.lifeTime <= 0) {
            this.removed = true;
        }
    }

}
