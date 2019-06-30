import * as PIXI from 'pixi.js';
import { getDoubleDimensionArray, getRectangle } from './utility';
import play from './play';
import { config, ConfigType } from "./config";

interface StateType {
  (stage: PIXI.Container, config?: ConfigType): void;
}
let state: StateType;

function setup(config: ConfigType) {
  //Create a Pixi Application
  const app = new PIXI.Application({
    width: config.SCREEN_WIDTH,
    height: config.SCREEN_HEIGHT
  });

  //Add the canvas that Pixi automatically created for you to the HTML document
  document.body.appendChild(app.view);

  //set the game state to `play`
  state = play;

  getDoubleDimensionArray(config.REEL_AMOUNT, config.SYMBOLS_AMOUNT + 2).forEach(
    (reel, reelIndex) => {
      const reelContainer = new PIXI.Container();

      reel.forEach(symbolIndex => {
        const rectangle = getRectangle(config);
        const y = (symbolIndex - 1) * config.SYMBOL_HEIGHT + config.MARGIN;
        const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
        rectangle.position.set(x, y);

        reelContainer.addChild(rectangle);
      });

      app.stage.addChild(reelContainer);
    }
  );

  const sixtyTimes = (fn: StateType) => {
    let times = 5;
    return (stage: PIXI.Container) => {
      if (times === 0) return;
      times--;
      fn(stage);
    };
  };

  const pl = sixtyTimes(play);

  //Start the game loop
  app.ticker.add(
    () => {
      // pl(app.stage);
      play(app.stage, config);
    }
    // delta => gameLoop(delta)
  );
}

setup(config);
