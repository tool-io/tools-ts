import { describe, expect, it } from "vitest";
import { runPpmToMolarity } from "./tool.js";

describe("PPM to Molarity Converter", () => {
  it("calculates a valid result", () => {
    const result = runPpmToMolarity({ molarMassGMol: 58.44, ppm: 1000 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.molarityMolL).toBeCloseTo(0.017111567419575632, 15);
  });

  it("rejects invalid input", () =>
    expect(runPpmToMolarity(null).ok).toBe(false));
});
