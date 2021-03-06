import InputRouter from "./InputRouter.js";
import Keyboard from "./KeyboardState.js";
import Go from "./traits/Go.js";
import Jump from "./traits/Jump.js";

export function setupKeyboard(window) {
  const input = new Keyboard();
  const router = new InputRouter();

  input.listenTo(window);

  input.addMapping("KeyP", (keyState) => {
    if (keyState) {
      router.route((entity) => entity.getTrait(Jump).start());
    } else {
      router.route((entity) => entity.getTrait(Jump).cancel());
    }
  });

  input.addMapping("KeyO", (keyState) => {
    router.route((entity) => entity.turbo(keyState));
  });

  input.addMapping("KeyD", (keyState) => {
    router.route((entity) => (entity.getTrait(Go).dir += keyState ? 1 : -1));
  });

  input.addMapping("KeyA", (keyState) => {
    router.route((entity) => (entity.getTrait(Go).dir += keyState ? -1 : 1));
  });
  return router;
}
