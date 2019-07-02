import * as PIXI from 'pixi.js';

export default class Reel {
  public container: PIXI.Container;
  public symbols: PIXI.Graphics[];
  public filter: PIXI.filters.BlurFilter;
  public startTime: number;
  public spinTime: number;
  public position: number;
  public stopTime: number;
  constructor(
    container: PIXI.Container,
    symbols: PIXI.Graphics[],
    filter: PIXI.filters.BlurFilter,
    startTime: number,
    spinTime: number
  ) {
    this.container = container;
    this.symbols = symbols;
    this.filter = filter;
    this.startTime = startTime;
    this.spinTime = spinTime;
    this.position = 0;
    this.stopTime = 1;
  }

  /**
   * Add symbol to symbols array and container
   * @param {PIXI.Graphics} symbol Symbol which will be added
   */
  public add(symbol: PIXI.Graphics): void {
    this.container.addChildAt(symbol, 0);
    this.symbols.unshift(symbol);
  }

  /**
   * Remove symbol from symbols array and container
   * @param {PIXI.Graphics} symbol Symbol which will be removed
   */
  public remove(symbol: PIXI.Graphics) {
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
