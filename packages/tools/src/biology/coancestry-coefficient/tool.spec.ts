import { describe, expect, it } from "vitest";
import { runCoancestryCoefficient } from "./tool.js";

describe("Coancestry Coefficient", () => {
  it("halves the relationship coefficient", () =>
    expect(runCoancestryCoefficient({ relationshipCoefficient: 0.5 })).toEqual({
      ok: true,
      output: { coancestryPhi: 0.25 },
    }));
  it("maps self relationship to parent offspring kinship", () =>
    expect(runCoancestryCoefficient({ relationshipCoefficient: 1 })).toEqual({
      ok: true,
      output: { coancestryPhi: 0.5 },
    }));
  it("maps unrelated individuals to zero", () =>
    expect(runCoancestryCoefficient({ relationshipCoefficient: 0 })).toEqual({
      ok: true,
      output: { coancestryPhi: 0 },
    }));
  it("supports negative relationships", () =>
    expect(runCoancestryCoefficient({ relationshipCoefficient: -0.5 })).toEqual(
      { ok: true, output: { coancestryPhi: -0.25 } },
    ));
  it("keeps fractional coefficients exact", () =>
    expect(runCoancestryCoefficient({ relationshipCoefficient: 0.3 })).toEqual({
      ok: true,
      output: { coancestryPhi: 0.15 },
    }));
  it("rejects coefficients above one", () => {
    const result = runCoancestryCoefficient({ relationshipCoefficient: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
});
