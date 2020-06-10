import { Trait } from '../Entity.js';

export default class Stomp extends Trait {
    constructor() {
        super('stomp');
        this.bounceSpeed = 400;
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
            this.queue(() => this.bounce(subject, entity));
            subject.sounds.add('stomp');
            this.events.emit('stomp', subject, entity);
        }
    }
}