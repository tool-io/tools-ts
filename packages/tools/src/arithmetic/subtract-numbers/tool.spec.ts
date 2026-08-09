import { describe, expect, it } from "vitest";
import {
  subtractNumbers,
  subtractNumbersExample,
  runSubtractNumbers,
} from "./tool.js";

describe("Subtract N Numbers", () => {
  it("calculates the canonical example", () =>
    expect(subtractNumbers(subtractNumbersExample.input.values)).toBe(5));
  it("supports defined extended-real differences", () => {
    expect(subtractNumbers([Infinity, 1])).toBe(Infinity);
  });
  it("rejects an insufficient or undefined list", () => {
    expect(subtractNumbers([])).toBeNull();
    expect(subtractNumbers([1, Number.NaN])).toBeNull();
    expect(subtractNumbers([Infinity, Infinity])).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runSubtractNumbers(subtractNumbersExample.input)).toEqual({
      ok: true,
      output: subtractNumbersExample.output,
    }));
});
