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
        if (entity.killable && subject.vel.y > entity.vel.y) {
            this.bounce(subject, entity);
        }
    }
}