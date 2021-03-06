
/**
 * Returns true if the distance between p1 and p2 is smaller than distance.
 * @param {{x: number, y: number}} p1 
 * @param {{x: number, y: number}} p2 
 * @param {number} distance 
 */
export const closerThan = (p1, p2, distance) => {
    const { x, y } = different(p1, p2);
    return x * x + y * y < distance * distance;
};

/**
 * Returns the different between p1 and p2.
 * @param {{x: number, y: number}} p1 
 * @param {{x: number, y: number}} p2 
 */
export const different = (p1, p2) => {
    return { x: p2.x - p1.x, y: p2.y - p1.y };
};

export const radians = degree => degree * Math.PI / 180;

export const degree = radian => radian / Math.PI * 180;

export const pythagorean = (a, b) => Math.sqrt(a * a + b * b);
