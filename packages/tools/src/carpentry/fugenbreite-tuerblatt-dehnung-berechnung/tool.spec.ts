import { describe, expect, it } from "vitest";
import { doorFrameGapExample, runDoorFrameGap } from "./tool.js";

describe("Door Frame Width With Gaps", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDoorFrameGap(doorFrameGapExample.input)).toEqual({
      ok: true,
      output: doorFrameGapExample.output,
    });
  });

  it("matches an explicit three millimetre gap to the default", () => {
    expect(runDoorFrameGap({ gapPerSideMm: 3, leafWidthMm: 600 })).toEqual({
      ok: true,
      output: { frameInnerWidthMm: 606, totalSideGapMm: 6 },
    });
  });

  it("adds two custom gaps to the leaf width", () => {
    expect(runDoorFrameGap({ gapPerSideMm: 5, leafWidthMm: 800 })).toEqual({
      ok: true,
      output: { frameInnerWidthMm: 810, totalSideGapMm: 10 },
    });
  });

  it("allows a zero gap for a tight frame", () => {
    expect(runDoorFrameGap({ gapPerSideMm: 0, leafWidthMm: 625 })).toEqual({
      ok: true,
      output: { frameInnerWidthMm: 625, totalSideGapMm: 0 },
    });
  });

  it("accepts the ten millimetre maximum gap", () => {
    expect(runDoorFrameGap({ gapPerSideMm: 10, leafWidthMm: 500 })).toEqual({
      ok: true,
      output: { frameInnerWidthMm: 520, totalSideGapMm: 20 },
    });
  });

  it("rejects a zero leaf width", () => {
    const result = runDoorFrameGap({ leafWidthMm: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_leaf_width");
  });

  it("rejects a negative leaf width", () => {
    const result = runDoorFrameGap({ leafWidthMm: -600 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_leaf_width");
  });

  it("rejects gaps above ten millimetres", () => {
    const result = runDoorFrameGap({ gapPerSideMm: 10.5, leafWidthMm: 600 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects negative gaps", () => {
    expect(runDoorFrameGap({ gapPerSideMm: -3, leafWidthMm: 600 }).ok).toBe(
      false,
    );
  });

  it("requires the leaf width", () => {
    expect(runDoorFrameGap({}).ok).toBe(false);
  });
});
