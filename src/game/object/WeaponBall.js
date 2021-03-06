import GameObject from '.';
import Tank from './Tank';
import { weaponList } from '../weapon';
import { WEAPON_BALL } from '../constants';

export default class WeaponBall extends GameObject {

    constructor() {
        super({
            color: '#ffffffff',
            health: 1,
            maxHealth: 1,
            bodyDamage: 0,
            objectType: WEAPON_BALL
        });
        this.setWeapon(weaponList[Math.floor(Math.random() * weaponList.length)].name);
    }

    getInfo() {
        return super.getInfo().concat([
            this.weaponBallType
        ]);
    }

    setInfo(info) {
        let i = super.setInfo(info);
        this.setWeapon(info[i++]);
        return i;
    }

    setWeapon(weaponType) {
        if (this.weaponType !== weaponType) {
            this.weaponBallType = weaponType;
            this.weaponPreview = new Tank({ color: '#ffffffff', radius: this.radius * 0.4, shield: 0, weaponType });
        }
    }

    collide(otherObject) {
        super.collide(otherObject);
        if (this.removed && otherObject.weapon && otherObject.objectType !== WEAPON_BALL) {
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
