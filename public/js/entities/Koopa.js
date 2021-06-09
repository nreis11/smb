import Entity from "../Entity.js";
import PendulumMove from "../traits/PendulumMove.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Physics from "../traits/Physics.js";
import Trait from "../Trait.js";
import Stomper from "../traits/Stomper.js";

export function loadKoopa() {
  return loadSpriteSheet("koopa").then(createKoopaFactory);
}

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

class Behavior extends Trait {
  constructor() {
    super();
    this.state = STATE_WALKING;
    this.panicSpeed = 300;
    this.walkSpeed = null;
    this.hideTime = 0;
    this.hideDuration = 5;
  }

  collides(us, them) {
    if (us.getTrait(Killable).dead) {
      return;
    }

    if (them.hasTrait(Stomper)) {
      if (them.vel.y > us.vel.y) {
        us.getTrait(Behavior).handleStomp(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      them.getTrait(Killable).kill();
    } else if (this.state === STATE_HIDING) {
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      const travelDir = Math.sign(us.vel.x);
      const impactDir = Math.sign(us.pos.x - them.pos.x);

      if (travelDir && travelDir !== impactDir) {
        them.getTrait(Killable).kill();
      }
    }
  }

  handleStomp(us, them) {
    if (this.state === STATE_WALKING) {
      if (them.vel.y > us.vel.y) {
        this.hide(us);
      }
    } else if (this.state === STATE_HIDING) {
      us.getTrait(Killable).kill();
      us.vel.set(100, -200);
      us.getTrait(Solid).obstructs = false;
    } else if (this.state === STATE_PANIC) {
      this.hide(us);
    }
  }

  hide(us) {
    us.vel.x = 0;
    us.getTrait(PendulumMove).enabled = false;

    if (this.walkSpeed === null) {
      this.walkSpeed = us.getTrait(PendulumMove).speed;
    }
    this.state = STATE_HIDING;
  }

  unhide(us) {
    us.getTrait(PendulumMove).enabled = true;
    us.getTrait(PendulumMove).speed = this.walkSpeed;
    this.state = STATE_WALKING;
  }

  panic(us, them) {
    us.getTrait(PendulumMove).enabled = true;
    us.getTrait(PendulumMove).speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = STATE_PANIC;
  }

  update(us, { deltaTime }) {
    if (this.state === STATE_HIDING) {
      this.hideTime += deltaTime;

      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
        this.hideTime = 0;
      }
    }
  }
}

function createKoopaFactory(sprite) {
  const walkAnim = sprite.animations.get("walk");
  const wakeAnim = sprite.animations.get("wake");

  function routeAnim(koopa) {
    if (koopa.getTrait(Behavior).state === STATE_HIDING) {
      if (koopa.getTrait(Behavior).hideTime > 3) {
        return wakeAnim(koopa.lifetime);
      }
      return "hiding";
    } else if (koopa.getTrait(Behavior).state === STATE_PANIC) {
      return "hiding";
    }

    return walkAnim(koopa.lifetime);
  }

  function drawKoopa(context) {
    sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();

    koopa.addTrait(new Solid());
    koopa.addTrait(new Physics());
    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Behavior());
    koopa.addTrait(new Killable());

    koopa.size.set(16, 16);
    koopa.offset.set(0, 8);

    koopa.draw = drawKoopa;

    return koopa;
  };
}
