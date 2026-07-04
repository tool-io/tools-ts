import { describe, expect, it } from "vitest";
import { runExpectedValue } from "./tool.js";
describe("Expected Value Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runExpectedValue({ values: [0, 10], probabilities: [0.25, 0.75] }),
    ).toEqual({ ok: true, output: { expectedValue: 7.5 } });
  });
  it("rejects invalid input", () =>
    expect(runExpectedValue(null).ok).toBe(false));
});
