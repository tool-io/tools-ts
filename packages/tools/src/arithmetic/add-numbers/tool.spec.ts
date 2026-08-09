import { describe, expect, it } from "vitest";
import { addNumbers, addNumbersExample, runAddNumbers } from "./tool.js";

describe("Add N Numbers", () => {
  it("calculates the canonical example", () =>
    expect(addNumbers(addNumbersExample.input.values)).toBe(6));
  it("supports defined extended-real sums", () => {
    expect(addNumbers([Infinity, 1])).toBe(Infinity);
    expect(addNumbers([-Infinity, 1])).toBe(-Infinity);
  });
  it("rejects an insufficient or undefined list", () => {
    expect(addNumbers([])).toBeNull();
    expect(addNumbers([1, Number.NaN])).toBeNull();
    expect(addNumbers([Infinity, -Infinity])).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runAddNumbers(addNumbersExample.input)).toEqual({
      ok: true,
      output: addNumbersExample.output,
    }));
});
