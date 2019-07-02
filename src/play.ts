// import * as PIXI from 'pixi.js';
// import * as d3 from 'd3-ease';
import { ConfigType } from './config';
import Reel from './Reel';
import { StateType } from './types';

const interpolation = (a: number, b: number, t: number) => {
  return a * (1 - t) + b * t;
};

const backOut = (amount: number) => {
  return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
};

const easing = backOut(2);

const stop = () => {}

export default (allReels: Reel[], state: StateType , config: ConfigType, ) => {
  const lastY = config.MARGIN;
  allReels.forEach((reel, reelIndex) => {
    if (reel.stopTime) {
      const now = Date.now();
      const phase = Math.min(1, (now - reel.stopTime) / 1000);
      const newPosition = interpolation(0, reel.position * config.SYMBOL_HEIGHT, easing(phase));

      // Change the blur filter depends on reel speed
      reel.filter.blurY = Math.abs(reel.previousPosition - newPosition);
      reel.previousPosition = newPosition;

      // Move the reel to the new position
      reel.container.y = newPosition;

      // Check whether last reel stopped or not
      if (reelIndex === allReels.length - 1 && reel.isStopped(newPosition)) {
        state = stop;
      }

    } else {
      reel.filter.blurY = config.SPIN_SPEED;
      reel.container.y += config.SPIN_SPEED;
    }

    // 
    if (reel.container.y >= lastY) {
      reel.container.y = 0;
      if (reel.isStopping()) {
        reel.stopTime = Date.now();
      }
    }
  });


};
