import * as PIXI from 'pixi.js';

export default class Reel {
  public container: PIXI.Container;
  public symbols: PIXI.Sprite[];
  public filter: PIXI.filters.BlurFilter;
  public startTime: number;
  public spinTime: number;
  public position: number;
  public stopTime: number;
  //======================== DEBUG START ======================
  public rectangles: PIXI.Graphics[];
  //======================== DEBUG END ========================
  constructor(
    container: PIXI.Container,
    symbols: PIXI.Sprite[],
    rectangles: PIXI.Graphics[],
    filter: PIXI.filters.BlurFilter,
    startTime: number,
    spinTime: number
  ) {
    //======================== DEBUG START ======================
    this.rectangles = rectangles;
    //======================== DEBUG END ========================
    this.container = container;
    this.symbols = symbols;
    this.rectangles = rectangles;
    this.filter = filter;
    this.startTime = startTime;
    this.spinTime = spinTime;
    this.position = 0;
    this.stopTime = 1;
  }

  //======================== DEBUG START ======================
  public removeRect(rectangle: PIXI.Graphics) {
    rectangle.destroy();
    this.rectangles.pop();
  }
  public addRect(rectangle: PIXI.Graphics): void {
    this.container.addChildAt(rectangle, 0);
    this.rectangles.unshift(rectangle);
  }
  //======================== DEBUG END ========================

  /**
   * Add symbol to symbols array and container
   * @param {PIXI.Sprite} symbol Symbol which will be added
   */
  public add(symbol: PIXI.Sprite): void {
    this.container.addChildAt(symbol, 0);
    this.symbols.unshift(symbol);
  }

  /**
   * Remove symbol from symbols array and container
   * @param {PIXI.Sprite} symbol Symbol which will be removed
   */
  public remove(symbol: PIXI.Sprite) {
    symbol.destroy();
    this.symbols.pop();
  }

  /**
   * Determines whether reel stopping or not
   */
  public isStopping() {
    return Date.now() - this.startTime >= this.spinTime;
  }
}
