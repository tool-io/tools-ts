import { describe, expect, it } from "vitest";
import { addNumbers, addNumbersExample, runAddNumbers } from "./tool.js";

describe("Add N Numbers", () => {
  it("calculates the canonical example", () =>
    expect(addNumbers(addNumbersExample.input.values)).toBe(6));
  it("rejects an insufficient or non-finite list", () => {
    expect(addNumbers([])).toBeNull();
    expect(addNumbers([1, Number.NaN])).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runAddNumbers(addNumbersExample.input)).toEqual({
      ok: true,
      output: addNumbersExample.output,
    }));
});
