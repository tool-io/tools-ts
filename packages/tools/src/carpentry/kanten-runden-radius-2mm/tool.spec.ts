import { describe, expect, it } from "vitest";
import { edgeRoundingRemovalExample, runEdgeRoundingRemoval } from "./tool.js";

describe("Edge Rounding Removal Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runEdgeRoundingRemoval(edgeRoundingRemovalExample.input)).toEqual({
      ok: true,
      output: edgeRoundingRemovalExample.output,
    }));

  it("defaults to a two millimeter radius", () =>
    expect(runEdgeRoundingRemoval({})).toEqual({
      ok: true,
      output: { removedCrossSectionAreaMm2: 0.8584073464102069 },
    }));

  it("scales with the square of the radius", () =>
    expect(runEdgeRoundingRemoval({ radiusMm: 4 })).toEqual({
      ok: true,
      output: { removedCrossSectionAreaMm2: 3.4336293856408275 },
    }));

  it("handles a small half-millimeter radius", () =>
    expect(runEdgeRoundingRemoval({ radiusMm: 0.5 })).toEqual({
      ok: true,
      output: { removedCrossSectionAreaMm2: 0.05365045915063793 },
    }));

  it("handles a large fifty-millimeter radius", () =>
    expect(runEdgeRoundingRemoval({ radiusMm: 50 })).toEqual({
      ok: true,
      output: { removedCrossSectionAreaMm2: 536.5045915063793 },
    }));

  it("quadruples removed area when the radius doubles", () => {
    const small = runEdgeRoundingRemoval({ radiusMm: 6 });
    const large = runEdgeRoundingRemoval({ radiusMm: 12 });
    if (small.ok && large.ok)
      expect(
        Number(large.output.removedCrossSectionAreaMm2) /
          Number(small.output.removedCrossSectionAreaMm2),
      ).toBeCloseTo(4, 12);
    else expect.fail("expected successful results");
  });

  it("rejects a zero radius", () => {
    const result = runEdgeRoundingRemoval({ radiusMm: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_radius");
  });

  it("rejects a negative radius", () => {
    const result = runEdgeRoundingRemoval({ radiusMm: -2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_radius");
  });

  it("rejects non-finite input", () =>
    expect(runEdgeRoundingRemoval({ radiusMm: Number.NaN }).ok).toBe(false));

  it("rejects unknown input fields", () =>
    expect(runEdgeRoundingRemoval({ radiusMm: 2, extra: 1 } as never).ok).toBe(
      false,
    ));
});
