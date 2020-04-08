import Entity from './Entity.js';
import Jump from './traits/Jump.js';
import Walk from './traits/Walk.js';
import { loadSpriteSheet } from './loaders.js';
import { createAnimation } from './animation.js';

const FAST = 1 / 5000;
const SLOW = 1 / 1500;


export async function createMario() {
   const sprites = await loadSpriteSheet('mario');
   const mario = new Entity();

   mario.size.set(14, 16);
   mario.addTrait(new Walk());
   mario.walk.drag = SLOW;
   mario.addTrait(new Jump());

   mario.turbo = function setTurboState(turboOn) {
      this.walk.drag = turboOn
         ? FAST
         : SLOW;
   }

   const runAnimation = createAnimation(['run-1', 'run-2', 'run-3'], 8);

   function routeFrame(mario) {
      if (mario.jump.falling) return 'jump';
      if (mario.walk.distance > 0) {
         if (
            mario.vel.x > 0 && mario.walk.direction < 0
            || mario.vel.x < 0 && mario.walk.direction > 0
         ) {
            return 'brake';
         }
         return runAnimation(mario.walk.distance);
      }
      return 'idle';
   }

   mario.draw = function drawMario(context) {
      sprites.draw(routeFrame(this), context, 0, 0, this.walk.heading < 0);
   };

   return mario;
}