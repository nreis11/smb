import Keyboard from "./KeyboardState.js";

export function setupKeyboard(entity) {
  const input = new Keyboard();

  input.addMapping("Space", (keyState) => {
    if (keyState) {
      entity.jump.start();
    }
  });

  input.addMapping("ArrowRight", (keyState) => {
    entity.go.dir = keyState;
  });

  input.addMapping("ArrowLeft", (keyState) => {
    entity.go.dir = -keyState;
  });
  return input;
}
