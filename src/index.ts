import * as PIXI from 'pixi.js';
import { getDoubleDimensionArray, getRectangle, getRandomSprite } from './utility';
import play from './play';
import { StateType } from './types';
import { config, ConfigType } from './config';
import Reel from './Reel';

const imgPaths = [
  'assets\\img\\slotOverlay.png',
  'assets\\img\\winningFrameBackground.jpg',
  'assets\\img\\btn_spin_pressed.png',
  'assets\\img\\btn_spin_normal.png',
  'assets\\img\\btn_spin_hover.png',
  'assets\\img\\btn_spin_disable.png',
  'assets\\img\\symbols\\01.png',
  'assets\\img\\symbols\\02.png',
  'assets\\img\\symbols\\03.png',
  'assets\\img\\symbols\\04.png',
  'assets\\img\\symbols\\05.png',
  'assets\\img\\symbols\\06.png',
  'assets\\img\\symbols\\07.png',
  'assets\\img\\symbols\\08.png',
  'assets\\img\\symbols\\09.png',
  'assets\\img\\symbols\\10.png',
  'assets\\img\\symbols\\11.png',
  'assets\\img\\symbols\\12.png',
  'assets\\img\\symbols\\13.png'
];
const loader = new PIXI.Loader();
loader.add(imgPaths).load(setup);

function setup() {
  // Variables
  const allReels: Reel[] = [];

  //set the game state to `play`
  let state: StateType = play;

  //Create a Pixi Application
  const app = new PIXI.Application({
    width: config.SCREEN_WIDTH,
    height: config.SCREEN_HEIGHT
  });
  document.body.appendChild(app.view);

  //Background setup
  const background = new PIXI.Sprite(
    loader.resources['assets\\img\\winningFrameBackground.jpg'].texture
  );
  const backgroundContainer = new PIXI.Container();
  const columnAmount = Math.ceil(config.VIEWPORT_WIDTH / background.width);
  const rowAmount = Math.ceil(config.VIEWPORT_HEIGHT / background.height);

  getDoubleDimensionArray(columnAmount, rowAmount).forEach((arr, xIndex) => {
    arr.forEach(yIndex => {
      const back = new PIXI.Sprite(
        loader.resources['assets\\img\\winningFrameBackground.jpg'].texture
      );
      back.x = xIndex * back.width;
      back.y = yIndex * back.height;
      backgroundContainer.addChild(back);
      backgroundContainer.x = config.MARGIN;
      backgroundContainer.y = config.MARGIN;
    });
  });
  app.stage.addChild(backgroundContainer);

  // Reels setup
  getDoubleDimensionArray(config.REEL_AMOUNT, config.SYMBOLS_AMOUNT + 6).forEach(
    (reel, reelIndex) => {
      const symbols: PIXI.Sprite[] = [];
      //======================== DEBUG START ======================
      const rectangles: PIXI.Graphics[] = [];
      //======================== DEBUG END ========================
      const reelContainer = new PIXI.Container();
      const reelX = config.MARGIN + reelIndex * config.REEL_WIDTH;
      const reelY = 0;
      reelContainer.position.set(reelX, reelY);

      // Populates reels by symbols
      reel.forEach(symbolIndex => {
        //======================== DEBUG START ======================
        const rectangle = getRectangle(config);
        const rectangleX = 0;
        const rectangleY = symbolIndex * config.SYMBOL_HEIGHT;
        rectangle.position.set(rectangleX, rectangleY);
        //======================== DEBUG END ========================

        const symbol = getRandomSprite(imgPaths, loader, config);
        const symbolX = (config.REEL_WIDTH - symbol.width) / 2;;
        const symbolY = symbolIndex * config.SYMBOL_HEIGHT;
        symbol.position.set(symbolX, symbolY);

        // Add rectangle to symbols array
        reelContainer.addChild(symbol);
        symbols.push(symbol);
        //======================== DEBUG START ======================
        reelContainer.addChild(rectangle);
        rectangles.push(rectangle)
        //======================== DEBUG END ========================
      });

      const blur = new PIXI.filters.BlurFilter();
      blur.blurX = 0;
      blur.blurY = 0;
      reelContainer.filters = [blur];

      const spinTime = 1000 * (1 + 1 * reelIndex);
      const newReel = new Reel(reelContainer, symbols, rectangles, blur, 0, spinTime);

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

  // Play button setup
  const button = new PIXI.Sprite(loader.resources['assets\\img\\btn_spin_normal.png'].texture);
  button.interactive = true;
  button.width = button.height = config.BTN_RADIUS;
  button.position.set(
    config.SCREEN_WIDTH - config.BTN_RADIUS,
    config.SCREEN_HEIGHT - config.BTN_RADIUS
  );
  button.cursor = 'pointer';
  button.addListener('pointerdown', () => {
    allReels.forEach(reel => {
      reel.startTime = Date.now();
      reel.position = Math.ceil(Math.random() * allReels.length);
      reel.stopTime = null;
    });
  });
  app.stage.addChild(button);

  //Start the game loop
  app.ticker.add(
    () => {
      // pl(app.stage);
      play(allReels, config);
    }
    // delta => gameLoop(delta)
  );
}
