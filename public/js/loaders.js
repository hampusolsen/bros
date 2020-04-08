import SpriteSheet from './SpriteSheet.js';
import { createAnimation } from './animation.js';

export function loadImage(url) {
   return new Promise(resolve => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', () => resolve(image));
   });
}

export async function loadJSON(url) {
   const r = await fetch(url);
   return await r.json();
}

export async function loadSpriteSheet(name) {
   const sheet = await loadJSON(`/sprites/${name}.json`);
   const [sheetSpec, image] = await Promise
      .all([
         sheet,
         loadImage(sheet.imageURL)
      ]);

   const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

   if (sheetSpec.tiles) {
      sheetSpec.tiles.forEach(tileSpec => {
         sprites.defineTile(
            tileSpec.name,
            tileSpec.index[0],
            tileSpec.index[1]
         );
      });
   }

   if (sheetSpec.frames) {
      sheetSpec.frames.forEach(frameSpec => {
         sprites.define(frameSpec.name, ...frameSpec.rect);
      });
   }

   if (sheetSpec.animations) {
      sheetSpec.animations.forEach(animationSpec => {
         const animation = createAnimation(
            animationSpec.frames,
            animationSpec.frameLen
         );

         sprites.defineAnimation(animationSpec.name, animation);
      });
   }

   return sprites;
}

