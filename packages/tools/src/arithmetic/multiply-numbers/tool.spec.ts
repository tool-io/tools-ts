import { describe, expect, it } from "vitest";
import {
  multiplyNumbers,
  multiplyNumbersExample,
  runMultiplyNumbers,
} from "./tool.js";

describe("Multiply N Numbers", () => {
  it("calculates the canonical example", () =>
    expect(multiplyNumbers(multiplyNumbersExample.input.values)).toBe(24));
  it("rejects an insufficient or non-finite list", () => {
    expect(multiplyNumbers([])).toBeNull();
    expect(multiplyNumbers([1, Number.NaN])).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runMultiplyNumbers(multiplyNumbersExample.input)).toEqual({
      ok: true,
      output: multiplyNumbersExample.output,
    }));
});
