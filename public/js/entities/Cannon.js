import Entity from '../Entity.js';
import Emitter from '../traits/Emitter.js';
import { loadAudioBoard } from '../loaders/audio.js';
import { findPlayers } from '../player.js';

const HOLD_FIRE_DISTANCE = 30;

export async function loadCannon(audioContext, entityFactories) {
    const AudioBoard = await loadAudioBoard('cannon', audioContext);
    return createCannonFactory(AudioBoard, entityFactories);
}

function createCannonFactory(AudioBoard, entityFactories) {
    function emitBullet(cannon, level) {
        let direction;

        for (const player of findPlayers(level)) {
            if (player.pos.x > cannon.pos.x - HOLD_FIRE_DISTANCE &&
                player.pos.x < cannon.pos.x + HOLD_FIRE_DISTANCE) {
                return;
            }

            if (player.pos.x < cannon.pos.x) {
                direction = -1;
            } else {
                direction = 1;
            }
        }

        const bullet = entityFactories.bullet();
        bullet.pos.copy(cannon.pos);
        bullet.vel.set(80 * direction, 0);
        cannon.sounds.add('shoot');

        level.entities.add(bullet);
    }

    return function createCannon() {
        const Cannon = new Entity();
        Cannon.audio = AudioBoard;

        const emitter = new Emitter();
        emitter.interval = 4;
        emitter.emitters.push(emitBullet);
        Cannon.addTrait(emitter);

        return Cannon;
    }
}