import { loadSpriteSheet } from "../loaders.js";
import Entity, { Trait } from "../Entity.js";
import Killable from "../traits/Killable.js";
import PendulumMove from "../traits/PendulumMove.js";
import Physics from "../traits/Physics.js";
import Solid from '../traits/Solid.js';

export async function loadKoopa() {
    const Sprite = await loadSpriteSheet('Koopa');
    return createKoopaFactory(Sprite);
}

const STATE_WALKING = Symbol('walking');
const STATE_HIDING = Symbol('hiding');
const STATE_PANICKING = Symbol('panicking');

class Behavior extends Trait {
    constructor() {
        super('behavior');

        this.hideDuration = 5;
        this.hideTime = 0;

        this.wakeSpeed = null;
        this.panicSpeed = 300;

        this.state = STATE_WALKING;
    }

    collides(subject, entity) {
        if (subject.killable.dead) {
            return;
        }

        if (entity.stomp) {
            if (entity.vel.y > subject.vel.y) {
                this.handleStomp(subject, entity);
            } else {
                this.handleNudge(subject, entity);
            }
        }
    }

    handleNudge(subject, entity) {
        if (this.state === STATE_WALKING) {
            entity.killable.kill();
        } else if (this.state === STATE_HIDING) {
            this.panic(subject, entity);
        } else if (this.state === STATE_PANICKING) {
            const travelDirection = Math.sign(subject.vel.x);
            const impactDirection = Math.sign(subject.pos.x - entity.pos.x);

            if (travelDirection !== 0 && travelDirection !== impactDirection) {
                entity.killable.kill();
            }
        }
    }

    handleStomp(subject, entity) {
        if (this.state === STATE_WALKING) {
            this.hide(subject);
        } else if (this.state === STATE_HIDING) {
            subject.killable.kill();
            subject.vel.set(100, -200);
            subject.solid.obstructs = false;
        } else if (this.state === STATE_PANICKING) {
            this.hide(subject, entity);
        }
    }

    hide(subject) {
        subject.vel.x = 0;
        subject.pendulumMove.enabled = false;

        if (!this.walkSpeed) {
            this.walkSpeed = subject.pendulumMove.speed;
        }

        this.hideTime = 0;
        this.state = STATE_HIDING;
    }

    unhide(subject) {
        subject.pendulumMove.enabled = true;
        subject.pendulumMove.speed = this.walkSpeed;
        this.state = STATE_WALKING;
    }

    panic(subject, entity) {
        subject.pendulumMove.enabled = true;
        subject.pendulumMove.speed = this.panicSpeed * Math.sign(entity.vel.x);
        this.state = STATE_PANICKING;
    }

    update(entity, deltaTime) {
        if (this.state === STATE_HIDING) {
            this.hideTime += deltaTime;
            if (this.hideTime > this.hideDuration) {
                this.unhide(entity);
            }
        }
    }
}

function createKoopaFactory(Sprite) {
    const walkAnimation = Sprite.animations.get('walk');
    const wakeAnimation = Sprite.animations.get('wake');

    function routeAnimation(entity) {
        if (entity.behavior.state === STATE_HIDING || entity.behavior.state === STATE_PANICKING) {
            if (entity.behavior.hideTime > 3) {
                return wakeAnimation(entity.behavior.hideTime);
            }
            return 'hiding';
        }

        if (entity.behavior.state === STATE_PANICKING) {
            return 'hiding';
        }

        return walkAnimation(entity.lifetime);
    }

    function drawKoopa(context) {
        Sprite.draw(routeAnimation(this), context, 0, 0, this.vel.x < 0);
    }

    return function createKoopa() {
        const Koopa = new Entity();

        Koopa.size.set(16, 16);
        Koopa.offset.set(0, 8);

        Koopa.addTrait(new Behavior());
        Koopa.addTrait(new Killable());
        Koopa.addTrait(new PendulumMove());
        Koopa.addTrait(new Physics());
        Koopa.addTrait(new Solid());

        Koopa.draw = drawKoopa;

        return Koopa;
    };
}