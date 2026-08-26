import { describe, expect, it } from "vitest";
import {
  runSlidingDoorOverlap,
  slidingDoorOverlapExample,
  slidingDoorOverlapTool,
} from "./tool.js";

describe("Sliding Door Overlap Calculator", () => {
  it("computes the canonical example", () =>
    expect(runSlidingDoorOverlap(slidingDoorOverlapExample.input)).toEqual({
      ok: true,
      output: { totalOverlapMm: 50 },
    }));

  it("applies the default 25 mm junction overlap when omitted", () =>
    expect(runSlidingDoorOverlap({ doorCount: 2 })).toEqual({
      ok: true,
      output: { totalOverlapMm: 25 },
    }));

  it.each([
    [4, 20, 60],
    [6, 25, 125],
    [5, 30, 120],
  ])(
    "overlaps %p doors by %p mm per junction for %p mm total",
    (doorCount, overlapPerJunctionMm, expected) =>
      expect(
        runSlidingDoorOverlap({ doorCount, overlapPerJunctionMm }),
      ).toEqual({ ok: true, output: { totalOverlapMm: expected } }),
  );

  it("allows zero overlap per junction", () =>
    expect(
      runSlidingDoorOverlap({ doorCount: 3, overlapPerJunctionMm: 0 }),
    ).toEqual({ ok: true, output: { totalOverlapMm: 0 } }));

  it("rejects a single door", () => {
    const result = runSlidingDoorOverlap({ doorCount: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects fractional and non-finite door counts", () => {
    expect(runSlidingDoorOverlap({ doorCount: 2.5 }).ok).toBe(false);
    expect(runSlidingDoorOverlap({ doorCount: Number.NaN }).ok).toBe(false);
  });

  it("rejects negative overlap", () =>
    expect(
      runSlidingDoorOverlap({ doorCount: 3, overlapPerJunctionMm: -1 }).ok,
    ).toBe(false));

  it("rejects non-numeric inputs", () =>
    expect(runSlidingDoorOverlap({ doorCount: "3" } as never).ok).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runSlidingDoorOverlap({
      doorCount: 3,
      trackWidthMm: 100,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(slidingDoorOverlapExample))).toEqual(
      slidingDoorOverlapExample,
    );
    expect(slidingDoorOverlapTool.id).toBe(
      "carpentry/schiebetuer-ueberlappung",
    );
    expect(slidingDoorOverlapTool.execution).toEqual({ kind: "pure" });
  });
});
