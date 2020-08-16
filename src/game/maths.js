
/**
 * Returns true if the distance between p1 and p2 is smaller than distance.
 * @param {{x: number, y: number}} p1 
 * @param {{x: number, y: number}} p2 
 * @param {number} distance 
 */
export const closerThan = (p1, p2, distance) => {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;
    return a * a + b * b < distance * distance;
};

/**
 * Translates degree to radian.
 * @param {number} degree 
 */
export const radian = degree => degree * Math.PI / 180;
