import { describe, expect, it } from "vitest";
import { hingeCupPatternExample, runHingeCupPattern } from "./tool.js";

describe("110 Degree Hinge Cup Pattern", () => {
  it("reproduces its canonical example exactly with the default edge distance", () => {
    expect(runHingeCupPattern(hingeCupPatternExample.input)).toEqual({
      ok: true,
      output: hingeCupPatternExample.output,
    });
  });

  it("keeps the cup diameter constant at 35 millimeters", () => {
    expect(runHingeCupPattern({ edgeDistanceMm: 5 })).toEqual({
      ok: true,
      output: { cupDiameterMm: 35, minimumStileWidthMm: 45 },
    });
  });

  it("uses the lower boundary of three millimeters", () => {
    expect(runHingeCupPattern({ edgeDistanceMm: 3 })).toEqual({
      ok: true,
      output: { cupDiameterMm: 35, minimumStileWidthMm: 41 },
    });
  });

  it("uses the upper boundary of seven millimeters", () => {
    expect(runHingeCupPattern({ edgeDistanceMm: 7 })).toEqual({
      ok: true,
      output: { cupDiameterMm: 35, minimumStileWidthMm: 49 },
    });
  });

  it("accepts fractional edge distances", () => {
    expect(runHingeCupPattern({ edgeDistanceMm: 4.5 })).toEqual({
      ok: true,
      output: { cupDiameterMm: 35, minimumStileWidthMm: 44 },
    });
  });

  it("rejects edge distances below three millimeters", () => {
    const result = runHingeCupPattern({ edgeDistanceMm: 2.9 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.field).toBe("edgeDistanceMm");
  });

  it("rejects edge distances above seven millimeters", () => {
    expect(runHingeCupPattern({ edgeDistanceMm: 7.1 }).ok).toBe(false);
  });

  it("rejects non-finite edge distances", () => {
    expect(
      runHingeCupPattern({ edgeDistanceMm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runHingeCupPattern({ extra: true });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
