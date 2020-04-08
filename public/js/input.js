import Keyboard from './KeyboardState.js';

const LEFT = 'KeyA';
const RIGHT = 'KeyD';
const JUMP = 'KeyP';
const RUN = 'KeyO';

export function setupKeyboard(mario) {
   const input = new Keyboard();

   input.addMapping(
      JUMP,
      keyState => keyState
         ? mario.jump.start()
         : mario.jump.cancel(),
   );

   input.addMapping(
      RIGHT,
      keyState => mario.walk.direction += keyState
         ? 1
         : -1,
   );

   input.addMapping(
      LEFT,
      keyState => mario.walk.direction += keyState
         ? -1
         : 1,
   );

   input.addMapping(
      RUN,
      keyState => mario.turbo(keyState),
   );

   return input;
}