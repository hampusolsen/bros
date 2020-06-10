import Entity, { Trait } from '../Entity.js';
import Gravity from '../traits/Gravity.js';
import Killable from '../traits/Killable.js';
import Velocity from '../traits/Velocity.js';
import { loadSpriteSheet } from '../loaders.js';

export async function loadBullet() {
    const sprites = await loadSpriteSheet('bullet')
    return createBulletFactory(sprites);
}

class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.gravity = new Gravity();
    }

    collides(subject, entity) {
        if (subject.killable.dead) {
            return;
        }

        if (entity.stomp) {
            if (entity.vel.y > subject.vel.y) {
                subject.vel.set(100, -200);
                subject.killable.kill();
            } else {
                entity.killable.kill();
            }
        }
    }

    update(entity, gameContext, level) {
        if (entity.killable.dead) {
            this.gravity.update(entity, gameContext, level);
        }
    }
}

function createBulletFactory(sprites) {
    function drawBullet(context) {
        sprites.draw('bullet', context, 0, 0, this.vel.x < 0);
    }

    return function createBullet() {
        const Bullet = new Entity();
        Bullet.size.set(16, 14);

        Bullet.addTrait(new Behavior());
        Bullet.addTrait(new Killable());
        Bullet.addTrait(new Velocity());

        Bullet.draw = drawBullet;

        return Bullet;
    }
}