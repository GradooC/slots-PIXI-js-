// import * as PIXI from 'pixi.js';
import * as d3 from 'd3-ease';
import { ConfigType } from './config';
import { getRectangle } from './utility';
import Reel from './Reel';

export default (allReels: Reel[], config: ConfigType) => {
  const lastY = config.VIEWPORT_HEIGHT + config.MARGIN + config.SYMBOL_HEIGHT;

  allReels.forEach((reel: Reel, reelIndex) => {
    reel.filter.blurY = 3 * reelIndex;
    // const t = Math.max(1, );
    const customBackOut = d3.easeBackOut.overshoot(3);
    const currentSpeed = customBackOut(0.5);
    console.log(currentSpeed);

    reel.symbols.forEach(rectangle => {
      //===========TEST============
      
      //===========TEST============
      rectangle.y += currentSpeed;
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
