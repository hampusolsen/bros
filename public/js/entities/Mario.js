import Entity from '../Entity.js';
import Jump from '../traits/Jump.js';
import Killable from '../traits/Killable.js';
import Physics from '../traits/Physics.js';
import Solid from '../traits/Solid.js';
import Stomp from '../traits/Stomp.js';
import Walk from '../traits/Walk.js';
import { loadSpriteSheet } from '../loaders.js';
import { loadAudioBoard } from '../loaders/audio.js';

const FAST = 1 / 5000;
const SLOW = 1 / 1500;

export async function loadMario(audioContext) {
  const AudioBoard = await loadAudioBoard('mario', audioContext);
  const SpriteSheet = await loadSpriteSheet('mario');
  return createMarioFactory(SpriteSheet, AudioBoard);
}

function createMarioFactory(SpriteSheet, audioBoard) {
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
    Mario.audio = audioBoard;
    Mario.size.set(14, 16);

    Mario.addTrait(new Jump());
    Mario.addTrait(new Killable());
    Mario.addTrait(new Physics());
    Mario.addTrait(new Solid());
    Mario.addTrait(new Stomp());
    Mario.addTrait(new Walk());

    Mario.killable.removeAfter = 0;

    Mario.turbo = setTurboState;
    Mario.draw = drawMario;

    Mario.turbo(false)

    return Mario;
  }
}