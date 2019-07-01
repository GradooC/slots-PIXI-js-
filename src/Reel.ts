import * as PIXI from 'pixi.js';

export default class Reel {
  container: PIXI.Container;
  symbols: PIXI.Graphics[];
  filter: PIXI.filters.BlurFilter;
  startTime: Date;
  spinTime: number;
  constructor(
    container: PIXI.Container,
    symbols: PIXI.Graphics[],
    filter: PIXI.filters.BlurFilter,
    startTime: Date,
    spinTime: number
  ) {
    this.container = container;
    this.symbols = symbols;
    this.filter = filter;
    this.startTime = startTime;
    this.spinTime = spinTime;
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
}
