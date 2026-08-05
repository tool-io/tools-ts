import { describe, expect, it } from "vitest";
import {
  subtractNumbers,
  subtractNumbersExample,
  runSubtractNumbers,
} from "./tool.js";

describe("Subtract N Numbers", () => {
  it("calculates the canonical example", () =>
    expect(subtractNumbers(subtractNumbersExample.input.values)).toBe(5));
  it("rejects an insufficient or non-finite list", () => {
    expect(subtractNumbers([])).toBeNull();
    expect(subtractNumbers([1, Number.NaN])).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runSubtractNumbers(subtractNumbersExample.input)).toEqual({
      ok: true,
      output: subtractNumbersExample.output,
    }));
});
