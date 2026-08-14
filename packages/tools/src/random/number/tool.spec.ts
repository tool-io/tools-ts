import { describe, expect, it, vi } from "vitest";
import {
  calculateRandomInteger,
  randomNumberExample,
  runRandomNumber,
} from "./tool.js";
describe("random number", () => {
  it("uses injected randomness", () =>
    expect(
      runRandomNumber(randomNumberExample.input, { random: () => 0.5 }),
    ).toEqual({ ok: true, output: { value: 51 } }));

  it("rejects invalid bounds before sampling", () => {
    const random = vi.fn(() => 0);
    expect(calculateRandomInteger(2, 1, random)).toBeNull();
    expect(calculateRandomInteger(1.5, 2, random)).toBeNull();
    expect(random).not.toHaveBeenCalled();
  });

  it("rejects invalid random samples", () => {
    expect(calculateRandomInteger(1, 2, () => 1)).toBeNull();
    expect(calculateRandomInteger(1, 2, () => Number.NaN)).toBeNull();
  });
});
