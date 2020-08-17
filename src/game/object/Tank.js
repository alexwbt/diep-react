import GameObject, { createObjectInfo } from ".";
import Weapon from "../weapon";
import { radians } from "../maths";

export const createTankInfo = info => ({
    movementSpeed: 50,
    reloadSpeed: 1,
    bulletSpeed: 100,
    bulletDamage: 1,
    bulletPenetration: 10,
    weaponType: 'singleCannon',
    ...createObjectInfo(info)
});

export default class Tank extends GameObject {

    getData() {
        return {
            ...super.getData(),
            movementSpeed: this.movementSpeed,
            reloadSpeed: this.reloadSpeed,
            bulletSpeed: this.bulletSpeed,
            bulletDamage: this.bulletDamage,
            bulletPenetration: this.bulletPenetration,
            weapon: this.weapon.getData(),
            objectType: 'Tank'
        };
    }

    setData(data) {
        super.setData(data);
        this.movementSpeed = data.movementSpeed;
        this.reloadSpeed = data.reloadSpeed;
        this.bulletSpeed = data.bulletSpeed;
        this.bulletDamage = data.bulletDamage;
        this.bulletPenetration = data.bulletPenetration;

        if (data.weapon) {
            this.weapon = new Weapon(this, data.weapon.type);
            this.weapon.setData(data.weapon);
        } else {
            this.weapon = new Weapon(this, data.weaponType);
        }
    }

    move(direction, deltaTime) {
        if (this.movingSpeed !== 0 && this.movingDirection !== direction) {
            this.addForce({
                x: Math.cos(this.movingDirection) * this.movingSpeed,
                y: Math.sin(this.movingDirection) * this.movingSpeed
            });
            this.addForce({
                x: Math.cos(direction) * -this.movingSpeed,
                y: Math.sin(direction) * -this.movingSpeed
            });
        }
        this.movingDirection = direction;
        if (this.movingSpeed < this.movementSpeed)
            this.movingSpeed += this.movementSpeed * deltaTime;
        else this.movingSpeed = this.movementSpeed;
    }

    stop() {
        this.addForce({
            x: Math.cos(this.movingDirection) * this.movingSpeed,
            y: Math.sin(this.movingDirection) * this.movingSpeed
        });
        this.movingSpeed = 0;
    }

    update(deltaTime, game) {
        super.update(deltaTime);
        this.weapon.update(deltaTime, game);
    }

    render(ctx, game) {
        ctx.globalAlpha = this.alpha;
        this.weapon.render(ctx, game);
        ctx.globalAlpha = 0;
        super.render(ctx, game);
    }

    mapRender(ctx, map) {
        const { x, y, radius, onMap } = this.onMap(map);
        if (!onMap) return;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();



        let dir = radians(this.rotate);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(dir) * radius * 2, y + Math.sin(dir) * radius * 2);
        dir += radians(30);
        ctx.lineTo(x + Math.cos(dir) * radius * 1.5, y + Math.sin(dir) * radius * 1.5);
        dir -= radians(60);
        ctx.lineTo(x + Math.cos(dir) * radius * 1.5, y + Math.sin(dir) * radius * 1.5);
        ctx.closePath();
        ctx.fill();
    }

}
