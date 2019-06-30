import * as PIXI from 'pixi.js';
import { ConfigType } from './config';
import { getRectangle } from './utility';

export default (containers: PIXI.Container[], config: ConfigType) => {
  const lastY = config.VIEWPORT_HEIGHT + config.MARGIN + config.SYMBOL_HEIGHT;

  containers.forEach((reelContainer: PIXI.Container, reelIndex) => {
    console.log(reelContainer.filters)
    // reelContainer.filters[0].blurY = 6;

    reelContainer.children.forEach(rectangle => {
      rectangle.y += 1 + 1 * reelIndex;
      if (rectangle.y >= lastY) {
        const deltaY = rectangle.y - lastY;
        rectangle.destroy()

        const newRectangle = getRectangle(config);
        const y = config.MARGIN - config.SYMBOL_HEIGHT + deltaY;
        const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
        newRectangle.position.set(x, y);
        reelContainer.addChildAt(newRectangle, 0);
      }
    });
  });
};
