import { loadSpriteSheet } from "../loaders.js";
import Entity from "../Entity.js";
import PendulumWalk from "../traits/PendulumWalk.js";

export async function loadKoopa() {
    const Sprite = await loadSpriteSheet('Koopa');
    return createKoopaFactory(Sprite);
}

function createKoopaFactory(Sprite) {
    const walkAnimation = Sprite.animations.get('walk');

    function drawKoopa(context) {
        Sprite.draw(walkAnimation(this.lifetime), context, 0, 0, this.vel.x < 0);
    }

    return function createKoopa() {
        const Koopa = new Entity();

        Koopa.size.set(16, 16);
        Koopa.offset.set(0, 8);
        Koopa.addTrait(new PendulumWalk());
        Koopa.draw = drawKoopa;

        return Koopa;
    };
}