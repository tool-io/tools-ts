import { describe, expect, it } from "vitest";
import { runEquivalentConcentration } from "./tool.js";

describe("Equivalent Concentration Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runEquivalentConcentration({ equivalents: 0.5, volumeLiters: 2 }),
    ).toEqual({ ok: true, output: { eqPerLiter: 0.25 } });
  });

  it("rejects invalid input", () =>
    expect(runEquivalentConcentration(null).ok).toBe(false));
});
