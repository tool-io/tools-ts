import { describe, expect, it } from "vitest";
import { runElectrolysisTime } from "./tool.js";
describe("Electrolysis Time Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runElectrolysisTime({ molesMetal: 1, electronCount: 2, currentAmps: 2 }),
    ).toEqual({
      ok: true,
      output: { timeSeconds: 96485.33212 },
    }));
  it("rejects invalid input", () =>
    expect(
      runElectrolysisTime({ molesMetal: 1, electronCount: 2, currentAmps: 0 })
        .ok,
    ).toBe(false));
});
