import { describe, expect, it } from "vitest";
import { runNormalityFromMolarity } from "./tool.js";

describe("Normality From Molarity Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runNormalityFromMolarity({ equivalentsPerMole: 3, molarityMolL: 2 }),
    ).toEqual({ ok: true, output: { normality: 6 } });
  });

  it("rejects invalid input", () =>
    expect(runNormalityFromMolarity(null).ok).toBe(false));
});
