import { Trait } from '../Entity.js';

export default class Stomp extends Trait {
    constructor() {
        super('stomp');
        this.bounceSpeed = 400;
        this.didStomp = false;
        this.onStomp = function () { };
    }

    bounce(subject, entity) {
        subject.bounds.bottom = entity.bounds.top;
        subject.vel.y = -this.bounceSpeed;
    }

    collides(subject, entity) {
        if (!entity.killable || entity.killable.dead) {
            return;
        }

        if (subject.vel.y > entity.vel.y) {
            this.bounce(subject, entity);
            this.didStomp = true;
            this.onStomp(subject, entity);
        }
    }

    update(entity, { audioContext }) {
        if (this.didStomp) {
            entity.audio.playAudio('stomp', audioContext);
            this.didStomp = false;
        }
    }
}