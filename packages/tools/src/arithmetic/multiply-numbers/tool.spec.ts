import { describe, expect, it } from "vitest";
import {
  multiplyNumbers,
  multiplyNumbersExample,
  runMultiplyNumbers,
} from "./tool.js";

describe("Multiply N Numbers", () => {
  it("calculates the canonical example", () =>
    expect(multiplyNumbers(multiplyNumbersExample.input.values)).toBe(24));
  it("supports defined extended-real products", () => {
    expect(multiplyNumbers([Infinity, -2])).toBe(-Infinity);
  });
  it("rejects an insufficient or undefined list", () => {
    expect(multiplyNumbers([])).toBeNull();
    expect(multiplyNumbers([1, Number.NaN])).toBeNull();
    expect(multiplyNumbers([0, Infinity])).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runMultiplyNumbers(multiplyNumbersExample.input)).toEqual({
      ok: true,
      output: multiplyNumbersExample.output,
    }));
});
