import { ConfigType, config } from './config';
import * as PIXI from 'pixi.js';

/**
 * Produces double dimension array with specified length
 * @param outerLength Length of the outer array
 * @param innerLength Length of the inner array
 */
export const getDoubleDimensionArray = (outerLength: number, innerLength: number): number[][] =>
  new Array(outerLength)
    .fill(null)
    .map(() => new Array(innerLength).fill(null).map((el, index) => index));

/**
 * Returns sprite of the random symbol
 * @param imgPaths Array of the paths to all images
 * @param loader Instance of the PIXI.Loader
 * @param config Config object
 */
export const getRandomSprite = (
  /*mask: PIXI.Graphics*/

  imgPaths: string[],
  loader: PIXI.Loader,
  config: ConfigType
): PIXI.Sprite => {
  // Make textures from symbols
  const symbolsTextures = imgPaths
    .filter(path => /.*\\symbols\\.*/.test(path))
    .map(path => loader.resources[path].texture);

  // Get random array index
  const textureIndex = Math.floor(Math.random() * symbolsTextures.length);

  // Return sprite for random texture
  const sprite = new PIXI.Sprite(symbolsTextures[textureIndex]);

  // sprite.mask = mask;

  // Adjusting symbol size
  sprite.scale.x = sprite.scale.y = Math.min(
    config.REEL_WIDTH / sprite.width,
    config.SYMBOL_HEIGHT / sprite.height
  );
  
  return sprite;
};

export const getRectangle = (config: ConfigType) => {
  const width = config.REEL_WIDTH;
  const height = config.SYMBOL_HEIGHT;

  const rectangle = new PIXI.Graphics();
  rectangle.lineStyle(4, 0xff3300, 1).drawRoundedRect(0, 0, width, height, 20);

  return rectangle;
};
