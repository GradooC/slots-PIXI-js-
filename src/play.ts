import { ConfigType } from './types';
import Reel from './Reel';
import { StateType } from './types';

const interpolation = (a: number, b: number, t: number) => {
  return a * (1 - t) + b * t;
};

const backOut = (amount: number) => {
  return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
};

const easing = backOut(2);

export default (allReels: Reel[], state: StateType, config: ConfigType) => {
  const lastY = config.MARGIN;
  const startY = config.MARGIN + config.VIEWPORT_HEIGHT - (config.SYMBOLS_AMOUNT + 6) * config.SYMBOL_HEIGHT;
  allReels.forEach(reel => {
    if (reel.stopTime) {
      
      const now = Date.now();
      const phase = Math.min(1, (now - reel.stopTime) / 1000);
      const newPosition = interpolation(startY, startY + reel.position * config.SYMBOL_HEIGHT, easing(phase));

      // Change the blur filter depends on reel speed
      reel.filter.blurY = Math.abs(reel.previousPosition - newPosition);

      // Move the reel to the new position
      reel.container.y = newPosition;

      if (reel.previousPosition - newPosition === 0) {
        reel.isStopped = true;
      }
      reel.previousPosition = newPosition;
    } else {
      reel.filter.blurY = config.SPIN_SPEED;
      reel.container.y += config.SPIN_SPEED;
    }

    //
    if (reel.container.y >= lastY) {
      reel.container.y = startY;
      if (reel.isStopping()) {
        reel.stopTime = Date.now();
      }
    }
  });
};
