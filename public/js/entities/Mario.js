import Entity from "../Entity.js";
import Jump from "../traits/Jump.js";
import Stomper from "../traits/Stomper.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Go from "../traits/Go.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import Physics from "../traits/Physics.js";
import { loadAudioBoard } from "../loaders/audio.js";

const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 1000;

export function loadMario(audioContext) {
  return Promise.all([
    loadSpriteSheet("mario"),
    loadAudioBoard("mario", audioContext),
  ]).then(([sprite, audio]) => {
    return createMarioFactory(sprite, audio);
  });
}

function createMarioFactory(sprite, audio) {
  const runAnim = sprite.animations.get("run");

  function routeFrame(mario) {
    if (mario.traits.get(Killable).dead) {
      return "die";
    }

    if (mario.traits.get(Jump).falling) {
      return "jump";
    }

    if (mario.traits.get(Go).distance > 0) {
      if (
        (mario.traits.get(Go).dir < 0 && mario.vel.x > 0) ||
        (mario.vel.x < 0 && mario.traits.get(Go).dir > 0)
      ) {
        return "break";
      }
      return runAnim(mario.traits.get(Go).distance);
    } else {
      return "idle";
    }
  }

  function setTurboState(turboOn) {
    this.traits.get(Go).dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
  }

  function drawMario(context) {
    sprite.draw(
      routeFrame(this),
      context,
      0,
      0,
      this.traits.get(Go).heading < 0
    );
  }

  return function createMario() {
    const mario = new Entity();
    mario.audio = audio;
    mario.size.set(14, 16);

    mario.addTrait(new Solid());
    mario.addTrait(new Physics());
    mario.addTrait(new Go());
    mario.addTrait(new Jump());
    mario.addTrait(new Stomper());
    mario.addTrait(new Killable());

    mario.traits.get(Killable).removeAfter = 0;

    mario.turbo = setTurboState;
    mario.turbo(false);

    mario.draw = drawMario;

    return mario;
  };
}
