import { Trait } from '../Entity.js';

export default class Walk extends Trait {
   constructor() {
      super('walk');

      this.direction = 0;
      this.acceleration = 400;
      this.deceleration = 300;
      this.drag;
      this.distance = 0;
      this.heading = 1;
   }

   update(entity, deltaTime) {
      const absX = Math.abs(entity.vel.x);

      if (this.direction !== 0) {
         entity.vel.x += this.acceleration * deltaTime * this.direction;
         this.heading = this.direction;
         this.distance += absX * deltaTime;
      }
      else if (entity.vel.x !== 0) {
         const deceleration = Math.min(absX, this.deceleration * deltaTime);
         entity.vel.x += entity.vel.x > 0
            ? -deceleration
            : deceleration;
      }
      else {
         this.distance = 0;
      }

      const drag = this.drag * entity.vel.x * absX;
      entity.vel.x -= drag;

      this.distance += absX * deltaTime;
   }
}