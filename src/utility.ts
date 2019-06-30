import { ConfigType } from './config';
import * as PIXI from 'pixi.js';

export const getDoubleDimensionArray = (
  outerLength: number,
  innerLength: number
): number[][] =>
  new Array(outerLength)
    .fill(null)
    .map(() => new Array(innerLength).fill(null).map((el, index) => index));

export const getRectangle = (config: ConfigType) => {
  const width = config.REEL_WIDTH;
  const height = config.SYMBOL_HEIGHT;

  const rectangle = new PIXI.Graphics();
  rectangle.lineStyle(4, 0xff3300, 1).drawRoundedRect(0, 0, width, height, 30);

  return rectangle;
};
