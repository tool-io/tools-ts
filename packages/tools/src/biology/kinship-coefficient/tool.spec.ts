import { describe, expect, it } from "vitest";
import { runKinshipCoefficient } from "./tool.js";

describe("Kinship From Path", () => {
  it("computes kinship across two generations", () =>
    expect(runKinshipCoefficient({ pathLength: 2 })).toEqual({
      ok: true,
      output: { kinshipCoefficient: 0.125 },
    }));
  it("computes parent offspring kinship", () =>
    expect(runKinshipCoefficient({ pathLength: 1 })).toEqual({
      ok: true,
      output: { kinshipCoefficient: 0.25 },
    }));
  it("doubles for a fully inbred common ancestor", () =>
    expect(
      runKinshipCoefficient({ commonAncestorInbreedingF: 1, pathLength: 2 }),
    ).toEqual({ ok: true, output: { kinshipCoefficient: 0.25 } }));
  it("adds a fractional inbreeding term", () =>
    expect(
      runKinshipCoefficient({
        commonAncestorInbreedingF: 0.25,
        pathLength: 2,
      }),
    ).toEqual({ ok: true, output: { kinshipCoefficient: 0.15625 } }));
  it("shrinks for long paths", () =>
    expect(runKinshipCoefficient({ pathLength: 4 })).toEqual({
      ok: true,
      output: { kinshipCoefficient: 0.03125 },
    }));
  it("rejects a zero path length", () => {
    const result = runKinshipCoefficient({ pathLength: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_path");
  });
  it("rejects a negative path length", () => {
    const result = runKinshipCoefficient({ pathLength: -2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_path");
  });
});
