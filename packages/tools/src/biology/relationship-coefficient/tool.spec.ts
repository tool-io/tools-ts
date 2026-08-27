import { describe, expect, it } from "vitest";
import { runRelationshipCoefficient } from "./tool.js";

describe("Additive Relationship", () => {
  it("counts two paths two generations apart", () =>
    expect(
      runRelationshipCoefficient({
        commonAncestorPathsInt: 2,
        generationsInt: 2,
      }),
    ).toEqual({ ok: true, output: { relationshipCoefficientR: 0.5 } }));
  it("halves across a single generation", () =>
    expect(
      runRelationshipCoefficient({
        commonAncestorPathsInt: 1,
        generationsInt: 1,
      }),
    ).toEqual({ ok: true, output: { relationshipCoefficientR: 0.5 } }));
  it("decays across four generations", () =>
    expect(
      runRelationshipCoefficient({
        commonAncestorPathsInt: 3,
        generationsInt: 4,
      }),
    ).toEqual({ ok: true, output: { relationshipCoefficientR: 0.1875 } }));
  it("yields zero without common ancestor paths", () =>
    expect(
      runRelationshipCoefficient({
        commonAncestorPathsInt: 0,
        generationsInt: 3,
      }),
    ).toEqual({ ok: true, output: { relationshipCoefficientR: 0 } }));
  it("rejects a generation distance below one", () => {
    const result = runRelationshipCoefficient({
      commonAncestorPathsInt: 1,
      generationsInt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative paths", () => {
    const result = runRelationshipCoefficient({
      commonAncestorPathsInt: -1,
      generationsInt: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("commonAncestorPathsInt");
  });
  it("rejects non integer generations", () => {
    const result = runRelationshipCoefficient({
      commonAncestorPathsInt: 1,
      generationsInt: 1.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("generationsInt");
  });
});
