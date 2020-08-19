import GameObject from '.';
import Tank from './Tank';
import { weaponList } from '../weapon';

export default class WeaponBall extends GameObject {

    constructor() {
        super({
            color: 'white',
            health: 1,
            maxHealth: 1,
            bodyDamage: 0,
            weaponBallType: weaponList[Math.floor(Math.random() * weaponList.length)].name
        });
    }

    getData() {
        return {
            ...super.getData(),
            weaponBallType: this.weaponBallType,
            objectType: 'WeaponBall'
        };
    }

    setData(data) {
        super.setData(data);
        this.weaponBallType = data.weaponBallType;
        this.weaponPreview = new Tank({ color: 'white', radius: this.radius * 0.4, weaponType: this.weaponBallType });
    }

    collide(otherObject) {
        super.collide(otherObject);
        if (this.removed && typeof otherObject.setWeapon === 'function') {
            otherObject.setWeapon(this.weaponBallType);
        } else {
            this.removed = false;
            this.health = this.maxHealth;
        }
    }

    render(ctx, game) {
        super.render(ctx, game);
        this.weaponPreview.x = this.x;
        this.weaponPreview.y = this.y;
        this.weaponPreview.render(ctx, game);
    }


}
