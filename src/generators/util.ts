export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// "1x^2" looks sloppy; render coefficient 1 as empty string.
export function coef(a: number): string {
  return a === 1 ? "" : String(a);
}

// Renders x^{n}, collapsing x^{1} to plain x.
export function pow(exp: number): string {
  return exp === 1 ? "x" : `x^{${exp}}`;
}
