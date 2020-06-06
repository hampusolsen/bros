import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import Timer from './Timer.js';
import { createLevelLoader } from './loaders/level.js';
import { setupKeyboard } from './input.js';
import { loadEntities } from './entities.js';

const canvas = document.querySelector('#screen');

function createPlayerEnvironment(entity) {
   const playerEnvironment = new Entity();
   const playerControl = new PlayerController();

   playerControl.checkpoint.set(64, 64);
   playerControl.setPlayer(entity);
   playerEnvironment.addTrait(playerControl);

   return playerEnvironment;
}

(async () => {
   const context = canvas.getContext('2d');
   const entityFactory = await loadEntities();
   const loadLevel = createLevelLoader(entityFactory);
   const level = await loadLevel('1-1');
   const camera = new Camera();
   window.camera = camera;

   const mario = entityFactory.mario();
   level.entities.add(mario);

   const playerEnvironment = createPlayerEnvironment(mario);
   level.entities.add(playerEnvironment);

   const input = setupKeyboard(mario);
   input.listenTo(window);


   const timer = new Timer(1 / 60);
   timer.update = function update(deltaTime) {
      level.update(deltaTime);

      if (mario.pos.x > 100) {
         camera.pos.x = Math.max(0, mario.pos.x - 100);
      }

      level.comp.draw(context, camera);
   }

   timer.start();
})();
