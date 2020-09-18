
// object types
let i = 0;
export const GAME_OBJECT = i++;
export const REGULAR_POLYGON = i++;
export const TANK = i++;
export const CANNON_BALL = i++;
export const BUSH = i++;
export const AD_TANK = i++;
export const MISSILE = i++;
export const ROCKET = i++;
export const GRAVITY_FIELD = i++;

// item ball object types
export const WEAPON_BALL = i++;
export const HEAL_BALL = i++;
export const SHIELD_BALL = i++;
export const AD_TANK_BALL = i++;
export const GRENADE = i++;

// shapes
export const CIRCLE = 0;
export const POLYGON = 1;
export const AABB = 2;

// color
export const color = value => value && '#' + value.toString(16).padStart(8, 0);
export const colorValue = color => parseInt(color.replace(/#/, '0x'));

// default value
export const defaultValue = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;
