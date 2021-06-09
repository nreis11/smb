import Entity from "../Entity.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import Killable from "../traits/Killable.js";
import Velocity from "../traits/Velocity.js";
import Gravity from "../traits/Gravity.js";
import Trait from "../Trait.js";
import Stomper from "../traits/Stomper.js";

export function loadBullet() {
  return loadSpriteSheet("bullet").then(createBulletFactory);
}

class Behavior extends Trait {
  constructor() {
    super();
    this.gravity = new Gravity();
  }

  collides(us, them) {
    if (us.getTrait(Killable).dead) {
      return;
    }

    if (them.hasTrait(Stomper)) {
      if (them.vel.y > us.vel.y) {
        us.getTrait(Killable).kill();
        us.vel.set(100, -200);
      } else {
        them.getTrait(Killable).kill();
      }
    }
  }

  update(entity, gameContext, level) {
    if (entity.getTrait(Killable).dead) {
      this.gravity.update(entity, gameContext, level);
    }
  }
}

function createBulletFactory(sprite) {
  function drawBullet(context) {
    sprite.draw("bullet", context, 0, 0, this.vel.x > 0);
  }

  return function createBullet() {
    const bullet = new Entity();
    bullet.size.set(16, 16);

    bullet.addTrait(new Velocity());
    bullet.addTrait(new Behavior());
    bullet.addTrait(new Killable());
    bullet.draw = drawBullet;

    return bullet;
  };
}
