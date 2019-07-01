// import * as PIXI from 'pixi.js';
import * as d3 from 'd3-ease';
import { ConfigType } from './config';
// import { getRectangle } from './utility';
import Reel from './Reel';



const interpolation = (a: number, b: number, t: number) => {
    return a * (1 - t) + b * t;
}

const backOut = (amount: number) => {
    return (t: number) => (--t * t * ((amount + 1) * t + amount) + 1);
}

const easing = backOut(2);

export default (allReels: Reel[], config: ConfigType) => {
  // const lastY = config.VIEWPORT_HEIGHT + config.MARGIN + config.SYMBOL_HEIGHT;
  const lastY = config.MARGIN;
  const stopTime = 1000;

  allReels.forEach((reel: Reel, reelIndex) => {

    // reel.container.y += 1;
    // console.log(reel.container.y);
    const isStop = Date.now() - reel.startTime >= reel.spinTime;
    if (isStop) {
      const now = Date.now();
      const phase = Math.min(1, (now - reel.startTime - 1000 * (reelIndex + 1)) / 1000 * (reelIndex + 1));
      // console.log(phase);
      const position = interpolation(0, 2 * config.SYMBOL_HEIGHT, easing(phase));
      reel.container.y = position;
    } else {
      reel.container.y += 5;
    }
    // reel.container.y  = isStop ? position : reel.container.y + 5;

    if (reel.container.y >= lastY) {
      reel.container.y = 0
    }



    //================== LEGACY =========================
    // reel.filter.blurY = 3 * reelIndex;

    // const now = Date.now();
    // const phase = Math.min(1, (now - reel.startTime) / reel.spinTime);
    // const position = interpolation(0, 1, easing(phase));

    // reel.symbols.forEach((rectangle, index) => {
    //   //===========TEST============
      

    //   rectangle.y = config.SYMBOL_HEIGHT * (index + 1) * position;
    //   //===========TEST============
    //   if (rectangle.y >= lastY) {
    //     const deltaY = rectangle.y - lastY;

    //     reel.remove(rectangle);

    //     const newRectangle = getRectangle(config);
    //     const y = config.MARGIN - config.SYMBOL_HEIGHT + deltaY;
    //     const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
    //     newRectangle.position.set(x, y);

    //     reel.add(newRectangle);
    //   }
    // });
    //================== LEGACY =========================
  });
};
