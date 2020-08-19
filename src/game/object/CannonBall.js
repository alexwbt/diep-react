import GameObject from ".";

export default class CannonBall extends GameObject {

    getData() {
        return {
            ...super.getData(),
            lifeTime: this.lifeTime,
            ownerId: this.ownerId,
            objectType: 'CannonBall'
        };
    }

    setData(data) {
        super.setData(data);
        this.lifeTime = data.lifeTime;
        this.ownerId = data.ownerId;
    }

    getOwner(game) {
        return game.objects.find(o => o.objectId === this.ownerId);
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
