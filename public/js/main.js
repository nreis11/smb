import Camera from "./Camera.js";
import Timer from "./Timer.js";
import { loadLevel } from "./loaders/level.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers.js";

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

Promise.all([loadEntities(), loadLevel("1-1")]).then(([entity, level]) => {
  const camera = new Camera();
  // window.camera = camera;
  const mario = entity.mario();
  const goomba = entity.goomba();
  const koopa = entity.koopa();
  mario.pos.set(64, 64);
  goomba.pos.set(220, 64);
  koopa.pos.set(120, 64);

  level.entities.add(mario).add(goomba).add(koopa);
  level.comp.layers.push(createCollisionLayer(level));

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    level.update(deltaTime);

    if (mario.pos.x > 100) {
      camera.pos.x = mario.pos.x - 100;
    }

    level.comp.draw(context, camera);
  };

  timer.start();
});
