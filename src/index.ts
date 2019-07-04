import * as PIXI from 'pixi.js';
import { getDoubleDimensionArray, getRectangle, getRandomSprite } from './utility';
import play from './play';
import { StateType, GameStageType, ConfigType } from './types';
import { config } from './config';
import Reel from './Reel';
import { reelSpinSound, landingSound } from './sounds';

let gameStage: GameStageType = 'end';

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
    height: config.SCREEN_HEIGHT,
    backgroundColor: 0x1099bb
  });
  document.body.appendChild(app.view);

  // Viewport setup
  const viewport = new PIXI.Graphics();
  const x = config.MARGIN;
  const y = config.MARGIN;
  viewport
    // .lineStyle(4, 0x4287f5, 1)
    .beginFill(0x4287f5, 0.5)
    .drawRoundedRect(x, y, config.VIEWPORT_WIDTH, config.VIEWPORT_HEIGHT, 20);
  app.stage.addChild(viewport);

  //Background setup
  const backgroundTexture = loader.resources['assets\\img\\winningFrameBackground.jpg'].texture;
  const backgroundContainer = new PIXI.Container();
  const columnAmount = Math.ceil(config.VIEWPORT_WIDTH / backgroundTexture.width);
  const rowAmount = Math.ceil(config.VIEWPORT_HEIGHT / backgroundTexture.height);

  getDoubleDimensionArray(columnAmount, rowAmount).forEach((arr, xIndex) => {
    arr.forEach(yIndex => {
      const back = new PIXI.Sprite(backgroundTexture);
      back.x = xIndex * back.width;
      back.y = yIndex * back.height;
      backgroundContainer.addChild(back);
      backgroundContainer.x = config.MARGIN;
      backgroundContainer.y = config.MARGIN;
    });
  });
  backgroundContainer.mask = viewport;
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
      const reelY = config.MARGIN + config.VIEWPORT_HEIGHT - (config.SYMBOLS_AMOUNT + 6) * config.SYMBOL_HEIGHT;
      reelContainer.position.set(reelX, reelY);

      // Populates reels by symbols
      reel.forEach(symbolIndex => {
        //======================== DEBUG START ======================
        const rectangle = getRectangle(config);
        const rectangleX = 0;
        const rectangleY = symbolIndex * config.SYMBOL_HEIGHT;
        rectangle.position.set(rectangleX, rectangleY);
        //======================== DEBUG END ========================

        const symbol = getRandomSprite(viewport, imgPaths, loader, config);
        const symbolX = (config.REEL_WIDTH - symbol.width) / 2;
        const symbolY = symbolIndex * config.SYMBOL_HEIGHT;
        symbol.position.set(symbolX, symbolY);

      
        // Add rectangle to symbols array
        reelContainer.addChild(symbol);
        symbols.push(symbol);
        //======================== DEBUG START ======================
        // reelContainer.addChild(rectangle); // Uncomment for debug 
        // rectangles.push(rectangle);
        //======================== DEBUG END ========================

      });

      // Set last textures the same as the first for smooth transition
      symbols.forEach((sprite, index, thisArray) => {
        if (index > symbols.length - 5) {
          const sameSpriteIndex = index - (symbols.length - 5) - 1;
          sprite.texture = symbols[sameSpriteIndex].texture;
        }
      })

      const blur = new PIXI.filters.BlurFilter();
      blur.blurX = 0;
      blur.blurY = 0;
      reelContainer.filters = [blur];

      const spinTime = config.BASE_SPIN_DURATION * (1 + 1 * reelIndex);
      const newReel = new Reel(reelContainer, symbols, rectangles, blur, 0, spinTime);

      allReels.push(newReel);
      app.stage.addChild(reelContainer);
    }
  );

  // Play button setup
  const button = new PIXI.Sprite(loader.resources['assets\\img\\btn_spin_normal.png'].texture);
  button.interactive = true;
  button.buttonMode = true;
  button.width = button.height = config.BTN_RADIUS;
  button.position.set(
    config.SCREEN_WIDTH - config.BTN_RADIUS,
    config.SCREEN_HEIGHT - config.BTN_RADIUS
  );
  button.addListener(
    'mouseover',
    () => (button.texture = loader.resources['assets\\img\\btn_spin_hover.png'].texture)
  );
  button.addListener(
    'mouseout',
    () => (button.texture = loader.resources['assets\\img\\btn_spin_normal.png'].texture)
  );
  button.addListener('pointerdown', () => {
    button.texture = loader.resources['assets\\img\\btn_spin_pressed.png'].texture;
    startPlay(allReels);
  });
  app.stage.addChild(button);

  // Overlay setup
  const overlay = new PIXI.Sprite(loader.resources['assets\\img\\slotOverlay.png'].texture);

  // Manually overlay adjusting 
  const overlayX = config.MARGIN - 25;
  const overlayY = config.MARGIN - 33;
  overlay.position.set(overlayX, overlayY);
  overlay.width = config.VIEWPORT_WIDTH + 70;
  overlay.height = config.VIEWPORT_HEIGHT + 50;
  app.stage.addChild(overlay);

  //Start the game loop
  app.ticker.add(() => {
    switch (gameStage) {
      case 'playing':
        play(allReels, state, config);
        button.interactive = false;
        button.buttonMode = false;
        button.texture = loader.resources['assets\\img\\btn_spin_disable.png'].texture;
        const isEnd = allReels.every(reel => reel.isStopped);

        if (isEnd) {
          gameStage = 'ending';
        }
        break;
      case 'ending':
        reelSpinSound.stop();
        landingSound.play();
        button.interactive = true;
        button.buttonMode = true;
        button.texture = loader.resources['assets\\img\\btn_spin_normal.png'].texture;
        gameStage = 'end';
        break;
      case 'end':
        break;
    }
  });
}

function startPlay(allReels: Reel[]) {
  allReels.forEach(reel => {
    reelSpinSound.play();
    reel.startTime = Date.now();
    reel.position = Math.ceil(Math.random() * allReels.length);
    reel.stopTime = null;
    reel.isStopped = false;
    gameStage = 'playing';
  });
}
