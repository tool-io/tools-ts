import type { ToolExecutionContext } from "./definition.js";

export const defaultRandomSeed = 0x746f6f6c;

export const normalizeRandomSeed = (seed: number): number => {
  if (!Number.isSafeInteger(seed))
    throw new TypeError("Random seed must be a safe integer.");
  return seed >>> 0;
};

/** A small, reproducible PRNG whose uint32 operations are portable across runtimes. */
export const createSeededRandom = (seed: number): (() => number) => {
  let state = normalizeRandomSeed(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const resolveRandom = (
  seed: number | undefined,
  context?: ToolExecutionContext,
): (() => number) => {
  if (seed !== undefined) return createSeededRandom(seed);
  if (context?.random) return context.random;
  return createSeededRandom(defaultRandomSeed);
};

export const randomIndex = (length: number, random: () => number): number => {
  if (!Number.isSafeInteger(length) || length < 1)
    throw new RangeError("Random selection needs a non-empty collection.");
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1)
    throw new RangeError("Injected random sources must return values in [0, 1).");
  return Math.floor(value * length);
};
