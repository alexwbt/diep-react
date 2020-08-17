import GameObject from ".";

export default class CannonBall extends GameObject {

    getData() {
        return {
            ...super.getData(),
            lifeTime: this.lifeTime,
            objectType: 'CannonBall'
        };
    }

    setData(data) {
        super.setData(data);
        this.lifeTime = data.lifeTime;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.lifeTime -= deltaTime;
        if (this.lifeTime <= 0) {
            this.removed = true;
        }
    }

}
