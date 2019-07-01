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

  getDoubleDimensionArray(config.REEL_AMOUNT, config.SYMBOLS_AMOUNT + 6).forEach(
    (reel, reelIndex) => {
      const reelContainer = new PIXI.Container();
      const reelX = config.MARGIN + reelIndex * config.REEL_WIDTH;
      const reelY = 0;
      reelContainer.position.set(reelX, reelY);
      const symbols: PIXI.Graphics[] = [];

      reel.forEach(symbolIndex => {
        const rectangle = getRectangle(config);
        const symbolX = 0;
        const symbolY = symbolIndex * config.SYMBOL_HEIGHT;
        rectangle.position.set(symbolX, symbolY);

        // Add rectangle to symbols array
        reelContainer.addChild(rectangle);
        symbols.push(rectangle);
      });

      const blur = new PIXI.filters.BlurFilter();
      blur.blurX = 0;
      blur.blurY = 0;
      reelContainer.filters = [blur];

      const spinTime = 1000 * (1 + 1 * reelIndex);
      const newReel = new Reel(reelContainer, symbols, blur, Date.now(), spinTime);
      allReels.push(newReel);

      app.stage.addChild(reelContainer);
    }
  );

  const viewport = new PIXI.Graphics();
  const x = config.MARGIN;
  const y = config.MARGIN;
  viewport
    .lineStyle(4, 0x4287f5, 1)
    .drawRoundedRect(x, y, config.VIEWPORT_WIDTH, config.VIEWPORT_HEIGHT, 20);
  app.stage.addChild(viewport);

  const playButton = new PIXI.Graphics();
  const radius = 50;
  const btnX = config.SCREEN_WIDTH - radius * 2;
  const btnY = config.SCREEN_HEIGHT - radius * 2;
  playButton
    .beginFill(0x9966ff)
    .drawCircle(btnX, btnY, radius)
    .endFill();
  playButton.interactive = true;
  playButton.buttonMode = true;
  playButton.cursor = 'pointer';
  playButton.addListener('pointerdown', () => {
    allReels.forEach(reel => {
      reel.startTime = Date.now()
    })
  });
  app.stage.addChild(playButton);

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
