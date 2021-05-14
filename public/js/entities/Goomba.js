import Entity, { Sides } from "../Entity.js";
import { loadSpriteSheet } from "../loaders.js";
import PendulumWalk from "../traits/PendulumWalk.js";

export function loadGoomba() {
  return loadSpriteSheet("goomba").then(createGoombaFactory);
}

function createGoombaFactory(sprite) {
  const walkAnim = sprite.animations.get("walk");

  function drawGoomba(context) {
    sprite.draw(walkAnim(this.lifetime), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();

    goomba.size.set(16, 16);

    goomba.addTrait(new PendulumWalk());
    goomba.draw = drawGoomba;

    return goomba;
  };
}
