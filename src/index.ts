import * as PIXI from 'pixi.js';
import { getDoubleDimensionArray, getRectangle } from './utility';
import play from './play';
import { StateType } from './types';
import { config, ConfigType } from './config';
import Reel from './Reel';

function setup(config: ConfigType) {

  //Create a Pixi Application
  const app = new PIXI.Application({
    width: config.SCREEN_WIDTH,
    height: config.SCREEN_HEIGHT
  });
  document.body.appendChild(app.view);

  //set the game state to `play`
  let state: StateType = play;
  const allReels: Reel[] = [];

  getDoubleDimensionArray(config.REEL_AMOUNT, config.SYMBOLS_AMOUNT + 2).forEach(
    (reel, reelIndex) => {
      const reelContainer = new PIXI.Container();
      const symbols: PIXI.Graphics[] = [];

      reel.forEach(symbolIndex => {
        const rectangle = getRectangle(config);
        const y = (symbolIndex - 1) * config.SYMBOL_HEIGHT + config.MARGIN;
        const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
        rectangle.position.set(x, y);

        // Add rectangle to symbols array
        reelContainer.addChild(rectangle);
        symbols.push(rectangle);
      });

      const blur = new PIXI.filters.BlurFilter();
      blur.blurX = 0;
      blur.blurY = 0;
      reelContainer.filters = [blur];

      const spinTime = 1 + 1 * reelIndex;
      const newReel = new Reel(reelContainer, symbols, blur, new Date(), spinTime);
      allReels.push(newReel);

      app.stage.addChild(reelContainer);
    }
  );

  const viewport = new PIXI.Graphics();
  const x = config.MARGIN;
  const y = config.MARGIN;
  viewport
    .lineStyle(4, 0x4287f5, 1)
    .drawRoundedRect(x, y, config.VIEWPORT_WIDTH, config.VIEWPORT_HEIGHT, 30);
  app.stage.addChild(viewport);

  //============== For debug ==============
  // const sixtyTimes = (fn: StateType) => {
  //   let times = 5;
  //   return (containers: PIXI.Container[]) => {
  //     if (times === 0) return;
  //     times--;
  //     fn(allReels);
  //   };
  // };
  // // console.log(app.stage.children.filter(child => !(child instanceof PIXI.Graphics)));
  // const pl = sixtyTimes(play);
  //============== For debug ==============

  // const containers = app.stage.children.filter(<
  //   (child: PIXI.DisplayObject) => child is PIXI.Container
  // >(child => !(child instanceof PIXI.Graphics)));

  //Start the game loop
  app.ticker.add(
    () => {
      // pl(app.stage);
      play(allReels, config);
    }
    // delta => gameLoop(delta)
  );
}

setup(config);
