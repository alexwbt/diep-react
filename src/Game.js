import Game from './game/index';
import Tank from './game/object/Tank';

export const game = new Game();
const player = new Tank({ x: 10, weaponType: 'twinCannon' });
player.objectId = 0;
game.playerId = 0;
game.spawn(player);
game.spawnWeaponBalls();
game.spawnObstacles();