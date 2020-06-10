import Entity from './Entity.js';
import Player from './traits/Player.js';
import PlayerController from './traits/PlayerController.js';

export function createPlayerEnvironment(entity) {
    const playerEnvironment = new Entity();
    const playerControl = new PlayerController();

    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(entity);
    playerEnvironment.addTrait(playerControl);

    return playerEnvironment;
}

export function createPlayer(entity) {
    entity.addTrait(new Player());
    return entity;
}

export function* findPlayers(level) {
    for (const entity of level.entities) {
        if (entity.player) {
            yield entity;
        }
    }
}
