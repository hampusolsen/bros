import Entity, { Trait } from "../Entity.js";
import Killable from "../traits/Killable.js";
import PendulumMove from "../traits/PendulumMove.js";
import { loadSpriteSheet } from "../loaders.js";

export async function loadGoomba() {
    const SpriteSheet = await loadSpriteSheet('goomba');
    return createGoombaFactory(SpriteSheet);
}

class Behavior extends Trait {
    constructor() {
        super('behavior');
    }

    collides(subject, entity) {
        if (subject.killable.dead) {
            return;
        }

        if (entity.stomp) {
            if (entity.vel.y > subject.vel.y) {
                subject.killable.kill();
                subject.pendulumMove.speed = 0;
            } else {
                entity.killable.kill();
            }
        }
    }
}

function createGoombaFactory(SpriteSheet) {
    const walkAnimation = SpriteSheet.animations.get('walk');

    function routeAnimation(goomba) {
        if (goomba.killable.dead) {
            return 'flat';
        }

        return walkAnimation(goomba.lifetime);
    }

    function drawGoomba(context) {
        SpriteSheet.draw(routeAnimation(this), context, 0, 0);
    }

    return function createGoomba() {
        const Goomba = new Entity();

        Goomba.size.set(16, 16);

        Goomba.addTrait(new PendulumMove());
        Goomba.addTrait(new Behavior());
        Goomba.addTrait(new Killable());

        Goomba.draw = drawGoomba;

        return Goomba;
    };
}