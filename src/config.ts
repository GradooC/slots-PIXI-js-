export const config = {
  SCREEN_WIDTH: 1200,
  SCREEN_HEIGHT: 800,
  MARGIN: 300,
  REEL_AMOUNT: 5,
  SYMBOLS_AMOUNT: 4,
  BTN_RADIUS: 100,
  SPIN_SPEED: 10,
  get VIEWPORT_WIDTH() {
    return this.SCREEN_WIDTH - this.MARGIN * 2;
  },
  get VIEWPORT_HEIGHT() {
    return this.SCREEN_HEIGHT - this.MARGIN * 2;
  },
  get REEL_WIDTH() {
    return this.VIEWPORT_WIDTH / this.REEL_AMOUNT;
  },
  get SYMBOL_HEIGHT() {
    return this.VIEWPORT_HEIGHT / this.SYMBOLS_AMOUNT;
  }
};

export type ConfigType = typeof config;