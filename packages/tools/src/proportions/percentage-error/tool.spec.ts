import { describe, expect, it } from "vitest";
import { runPercentageError } from "./tool.js";
describe("Percentage Error Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runPercentageError({ observedValue: 98, acceptedValue: 100 }),
    ).toEqual({ ok: true, output: { percentError: 2 } });
  });
  it("rejects invalid input", () =>
    expect(runPercentageError(null).ok).toBe(false));
});
