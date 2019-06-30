import * as PIXI from 'pixi.js';
import { ConfigType } from './config';
import { getRectangle } from './utility';

export default (stage: PIXI.Container, config: ConfigType) => {
  const lastY =
    (config.SYMBOLS_AMOUNT) * config.SYMBOL_HEIGHT + config.MARGIN;

  stage.children.forEach((reelContainer: PIXI.Container, reelIndex) => {
    reelContainer.children.forEach(rectangle => {
      rectangle.y += 1;
      if (rectangle.y >= lastY) {
        const deltaY = rectangle.y - lastY;
        reelContainer.removeChild(rectangle);

        const newRectangle = getRectangle(config);
        const y = lastY - config.SYMBOLS_AMOUNT * config.SYMBOL_HEIGHT + deltaY;
        const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
        newRectangle.position.set(x, y);
        reelContainer.addChildAt(newRectangle, 0);
      }
    });
  });
};
