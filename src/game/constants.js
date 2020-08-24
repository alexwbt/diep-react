
// object types
export const GAME_OBJECT = 0;
export const REGULAR_POLYGON = 1;
export const TANK = 2;
export const CANNON_BALL = 3;
export const WEAPON_BALL = 4;
export const HEAL_BALL = 5;

// shapes
export const CIRCLE = 0;
export const POLYGON = 1;
export const AABB = 3;

// color
export const color = value => value && '#' + value.toString(16).padStart(8, 0);
export const colorValue = color => parseInt(color.replace(/#/, '0x'));

// default value
export const defaultValue = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;
