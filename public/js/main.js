import Camera from './Camera.js';
import Timer from './Timer.js';
import { createPlayerEnvironment, createPlayer } from './player.js';
import { createLevelLoader } from './loaders/level.js';
import { setupKeyboard } from './input.js';
import { loadEntities } from './entities.js';
import { loadFont } from './loaders/font.js';
import { createDashboardLayer } from './layers/dashboard.js';
import { createCollisionLayer } from './layers/collision.js';

const canvas = document.querySelector('#screen');


(async () => {
   const context = canvas.getContext('2d');
   const audioContext = new AudioContext();
   const [entityFactory, font] = await Promise.all([
      loadEntities(audioContext),
      loadFont()
   ]);

   const loadLevel = createLevelLoader(entityFactory);
   const level = await loadLevel('1-1');

   const camera = new Camera();
   window.camera = camera;

   const mario = createPlayer(entityFactory.mario());
   console.log(mario);
   level.entities.add(mario);

   const playerEnvironment = createPlayerEnvironment(mario);
   level.entities.add(playerEnvironment);

   level.comp.layers.push(createCollisionLayer(level));
   level.comp.layers.push(createDashboardLayer(font, playerEnvironment));

   const input = setupKeyboard(mario);
   input.listenTo(window);

   const gameContext = {
      audioContext,
      deltaTime: null,
   };

   const timer = new Timer(1 / 60);
   timer.update = function update(deltaTime) {
      gameContext.deltaTime = deltaTime;
      level.update(gameContext);

      if (mario.pos.x > 100) {
         camera.pos.x = Math.max(0, mario.pos.x - 100);
      }

      level.comp.draw(context, camera);
   }

   timer.start();
})();
