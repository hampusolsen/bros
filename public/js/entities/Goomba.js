import { loadSpriteSheet } from "../loaders.js";
import Entity from "../Entity.js";
import PendulumWalk from "../traits/PendulumWalk.js";

export async function loadGoomba() {
    const SpriteSheet = await loadSpriteSheet('goomba');
    return createGoombaFactory(SpriteSheet);
}

function createGoombaFactory(SpriteSheet) {
    const walkAnimation = SpriteSheet.animations.get('walk');

    function drawGoomba(context) {
        SpriteSheet.draw(walkAnimation(this.lifetime), context, 0, 0);
    }

    return function createGoomba() {
        const Goomba = new Entity();

        Goomba.size.set(16, 16);
        Goomba.addTrait(new PendulumWalk());
        Goomba.draw = drawGoomba;

        return Goomba;
    };
}