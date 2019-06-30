import * as PIXI from 'pixi.js';
import { getDoubleDimensionArray, getRectangle } from './utility';
import play from './play';
import { config, ConfigType } from './config';

interface StateType {
  (containers: PIXI.Container[], config?: ConfigType): void;
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

  getDoubleDimensionArray(
    config.REEL_AMOUNT,
    config.SYMBOLS_AMOUNT + 2
  ).forEach((reel, reelIndex) => {
    const reelContainer = new PIXI.Container();

    reel.forEach(symbolIndex => {
      const rectangle = getRectangle(config);
      const y = (symbolIndex - 1) * config.SYMBOL_HEIGHT + config.MARGIN;
      const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
      rectangle.position.set(x, y);

      reelContainer.addChild(rectangle);
    });

    const blur = new PIXI.filters.BlurFilter();
    console.log(blur);
    blur.blurX = 0;
    blur.blurY = 0;
    reelContainer.filters = [blur];

    app.stage.addChild(reelContainer);
  });

  const viewport = new PIXI.Graphics();
  const x = config.MARGIN;
  const y = config.MARGIN;
  viewport
    .lineStyle(4, 0x4287f5, 1)
    .drawRoundedRect(x, y, config.VIEWPORT_WIDTH, config.VIEWPORT_HEIGHT, 30);
  app.stage.addChild(viewport);
  console.log(viewport instanceof PIXI.Container);

  //============== For debug ==============
  const sixtyTimes = (fn: StateType) => {
    let times = 5;
    return (containers: PIXI.Container[]) => {
      if (times === 0) return;
      times--;
      fn(containers);
    };
  };
  // console.log(app.stage.children.filter(child => !(child instanceof PIXI.Graphics)));
  const pl = sixtyTimes(play);
  //============== For debug ==============

  const containers = app.stage.children.filter(<
    (child: PIXI.DisplayObject) => child is PIXI.Container
  >(child => !(child instanceof PIXI.Graphics)));

  //Start the game loop
  app.ticker.add(
    () => {
      // pl(app.stage);
      play(containers, config);
    }
    // delta => gameLoop(delta)
  );
}

setup(config);
