import { describe, expect, it } from "vitest";
import { runPpbToMolarity } from "./tool.js";

describe("PPB to Molarity Converter", () => {
  it("calculates a valid result", () => {
    const result = runPpbToMolarity({ molarMassGMol: 62, ppb: 500 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.molarityMolL).toBeCloseTo(8.064516129032258e-6, 12);
  });

  it("rejects invalid input", () =>
    expect(runPpbToMolarity(null).ok).toBe(false));
});
