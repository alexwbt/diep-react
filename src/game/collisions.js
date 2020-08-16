import { closerThan } from './maths';

export const collision = (object1, object2) => {
    switch (`${object1.shape}:${object2.shape}`) {
        case 'circle:AABB': return circleVsAABB(object1, object2);
        case 'AABB:circle': return circleVsAABB(object2, object1);
        default: return false;
    }
};

/**
 * Returns true if circle collides with AABB.
 * @param {{x: number, y: number, radius: number}} circle 
 * @param {{a: {x: number, y: number}, b: {x: number, y: number}}} aabb 
 */
const circleVsAABB = (circle, aabb) => {
    const x = Math.min(aabb.b.x, Math.max(aabb.a.x, circle.x));
    const y = Math.min(aabb.b.y, Math.max(aabb.a.y, circle.y));
    return pointInCircle({ x, y }, circle);
};

/**
 * Returns true if the point is within the circle.
 * @param {{x: number, y: number}} point 
 * @param {{x: number, y: number, radius: number}} circle 
 */
const pointInCircle = (point, circle) => {
    return closerThan(point, circle, circle.radius);
};
