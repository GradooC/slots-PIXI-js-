// import * as PIXI from 'pixi.js';
import { ConfigType } from './config';
import { getRectangle } from './utility';
import Reel from './Reel';

export default (allReels: Reel[], config: ConfigType) => {
  const lastY = config.VIEWPORT_HEIGHT + config.MARGIN + config.SYMBOL_HEIGHT;

  allReels.forEach((reel: Reel, reelIndex) => {
    reel.filter.blurY = 3 * reelIndex;

    reel.symbols.forEach(rectangle => {
      rectangle.y += 1 + 1 * reelIndex;
      if (rectangle.y >= lastY) {
        const deltaY = rectangle.y - lastY;

        reel.remove(rectangle);

        const newRectangle = getRectangle(config);
        const y = config.MARGIN - config.SYMBOL_HEIGHT + deltaY;
        const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
        newRectangle.position.set(x, y);

        reel.add(newRectangle);
      }
    });
  });
};
