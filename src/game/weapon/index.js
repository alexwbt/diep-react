import Cannon from "./Cannon";
import MissileLauncher from "./MissileLauncher";
import RocketLauncher from "./RocketLauncher";

export const weaponList = [
    {
        name: 'singleCannon',
        compose: (weapon, owner) => {
            weapon.components.push(new Cannon(owner));
        }
    },
    {
        name: 'twinCannon',
        compose: (weapon, owner) => {
            weapon.components.push(new Cannon(owner, { bulletPenetration: 0.5, reloadSpeed: 0.5, bulletSpeed: 1.2, y: 0.5, }));
            weapon.components.push(new Cannon(owner, { bulletPenetration: 0.5, reloadSpeed: 0.5, bulletSpeed: 1.2, y: -0.5, delay: owner.reloadSpeed / 2 }));
        }
    },
    {
        name: 'triplet',
        compose: (weapon, owner) => {
            weapon.components.push(new Cannon(owner, { bulletPenetration: 2, bulletSpeed: 1.1, y: 0.5, delay: owner.reloadSpeed / 2 }));
            weapon.components.push(new Cannon(owner, { bulletPenetration: 2, bulletSpeed: 1.1, y: -0.5, delay: owner.reloadSpeed / 2 }));
            weapon.components.push(new Cannon(owner, { bulletPenetration: 2, bulletSpeed: 1.1, width: 1, length: 1.6 }));
        }
    },
    {
        name: 'minigun',
        compose: (weapon, owner) => {
            weapon.components.push(new Cannon(owner, {  bulletSpeed: 2, bulletPenetration: 0.5, reloadSpeed: 0.5, width: 0.4, y: 0.25 }));
            weapon.components.push(new Cannon(owner, {  bulletSpeed: 2, bulletPenetration: 0.5, reloadSpeed: 0.5, width: 0.4, y: -0.25 }));
            weapon.components.push(new Cannon(owner, {  bulletSpeed: 2, bulletPenetration: 0.5, reloadSpeed: 0.5, width: 0.4, y: 0.7, length: 1.3, delay: owner.reloadSpeed / 2 }));
            weapon.components.push(new Cannon(owner, {  bulletSpeed: 2, bulletPenetration: 0.5, reloadSpeed: 0.5, width: 0.4, y: -0.7, length: 1.3, delay: owner.reloadSpeed / 2 }));
        }
    },
    {
        name: 'shotgun',
        compose: (weapon, owner) => {
            weapon.components.push(new Cannon(owner, {  range: 0.4, bulletSpeed: 2, bulletDamage: 3, width: 0.4 }));
            weapon.components.push(new Cannon(owner, {  range: 0.6, bulletSpeed: 2, bulletDamage: 2, width: 0.4, rotate: 0.15, y: 0.3, length: 1.3, }));
            weapon.components.push(new Cannon(owner, {  range: 0.6, bulletSpeed: 2, bulletDamage: 2, width: 0.4, rotate: -0.15, y: -0.3, length: 1.3, }));
            weapon.components.push(new Cannon(owner, {  range: 0.6, bulletSpeed: 2, bulletDamage: 2, width: 0.4, rotate: -0.15, y: 0.7, length: 1.3, }));
            weapon.components.push(new Cannon(owner, {  range: 0.6, bulletSpeed: 2, bulletDamage: 2, width: 0.4, rotate: 0.15, y: -0.7, length: 1.3, }));
        }
    },
    {
        name: 'singleMissile',
        compose: (weapon, owner) => {
            weapon.components.push(new MissileLauncher(owner, { reloadSpeed: 0.5, width: 1.2, bulletSpeed: 1.5, bulletPenetration: 2 }));
        }
    },
    {
        name: 'quadMissile',
        compose: (weapon, owner) => {
            weapon.components.push(new MissileLauncher(owner, { bulletDamage: 2, bulletSpeed: 1.2, reloadSpeed: 1.5, length: 1.35, y:  0.25, rotate:  1.1 }));
            weapon.components.push(new MissileLauncher(owner, { bulletDamage: 2, bulletSpeed: 1.2, reloadSpeed: 1.5, length: 1.35, y: -0.25, rotate: -1.1 }));
            weapon.components.push(new MissileLauncher(owner, { bulletDamage: 2, bulletSpeed: 1.2, reloadSpeed: 1.5, length: 1.5, rotate: -0.62, delay: owner.reloadSpeed / 2 }));
            weapon.components.push(new MissileLauncher(owner, { bulletDamage: 2, bulletSpeed: 1.2, reloadSpeed: 1.5, length: 1.5, rotate:  0.62, delay: owner.reloadSpeed / 2 }));
        }
    },
    {
        name: 'bazooka',
        compose: (weapon, owner) => {
            weapon.components.push(new RocketLauncher(owner, { reloadSpeed: 4, length: 4.5, x: -2, y: -0.75 }));
        }
    },
    {
        name: 'sniper',
        compose: (weapon, owner) => {
            weapon.components.push(new Cannon(owner, { reloadSpeed: 3, width: 0.5, length: 3, bulletSpeed: 5, bulletDamage: 10, range: 1 }));
        }
    },
];

export default class Weapon {

    constructor(owner, type) {
        this.type = type;
        this.firing = false;
        this.components = [];
        (weaponList.find(w => w.name === type) || weaponList[0]).compose(this, owner);
    }

    getData() {
        return this.components.map(c => c.getData());
    }

    setData(data) {
        this.components.forEach((c, i) => c.setData(data[i]));
    }

    update(deltaTime, game) {
        this.components.forEach(c => c.update(deltaTime, game));
    }

    render(ctx, game) {
        this.components.forEach(c => c.render(ctx, game));
    }

}
