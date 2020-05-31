import Entity from '../Entity.js';
import Jump from '../traits/Jump.js';
import Walk from '../traits/Walk.js';
import { loadSpriteSheet } from '../loaders.js';

const FAST = 1 / 5000;
const SLOW = 1 / 1500;

export async function loadMario() {
  const SpriteSheet = await loadSpriteSheet('mario');
  return createMarioFactory(SpriteSheet);
}

function createMarioFactory(SpriteSheet) {
  const runAnimation = SpriteSheet.animations.get('run');

  function routeFrame(mario) {
    if (mario.jump.falling) return 'jump';
    if (mario.walk.distance > 0) {
      if (
        mario.vel.x > 0 && mario.walk.direction < 0 ||
        mario.vel.x < 0 && mario.walk.direction > 0
      ) {
        return 'brake';
      }
      return runAnimation(mario.walk.distance);
    }
    return 'idle';
  }

  function setTurboState(turboOn) {
    this.walk.drag = turboOn
      ? FAST
      : SLOW;
  }

  function drawMario(context) {
    SpriteSheet.draw(routeFrame(this), context, 0, 0, this.walk.heading < 0);
  };

  return function createMario() {
    const Mario = new Entity();
    Mario.size.set(14, 16);

    Mario.addTrait(new Walk());
    Mario.addTrait(new Jump());

    Mario.turbo = setTurboState;
    Mario.draw = drawMario;

    Mario.turbo(false)

    return Mario;
  }
}