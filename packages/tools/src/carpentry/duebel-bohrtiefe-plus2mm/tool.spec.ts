import { describe, expect, it } from "vitest";
import { dowelDrillDepthExample, runDowelDrillDepth } from "./tool.js";

describe("Dowel Drill Depth Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDowelDrillDepth(dowelDrillDepthExample.input)).toEqual({
      ok: true,
      output: dowelDrillDepthExample.output,
    });
  });

  it("adds two millimeters to half the dowel length", () => {
    expect(runDowelDrillDepth({ dowelLengthMm: 40 })).toEqual({
      ok: true,
      output: { drillDepthMm: 22 },
    });
  });

  it("handles the smallest positive dowel length", () => {
    expect(runDowelDrillDepth({ dowelLengthMm: 1 })).toEqual({
      ok: true,
      output: { drillDepthMm: 2.5 },
    });
  });

  it("accepts fractional dowel lengths", () => {
    expect(runDowelDrillDepth({ dowelLengthMm: 12.5 })).toEqual({
      ok: true,
      output: { drillDepthMm: 8.25 },
    });
  });

  it("handles long dowels", () => {
    expect(runDowelDrillDepth({ dowelLengthMm: 100 })).toEqual({
      ok: true,
      output: { drillDepthMm: 52 },
    });
  });

  it("rejects zero dowel length", () => {
    const result = runDowelDrillDepth({ dowelLengthMm: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects negative dowel lengths", () => {
    expect(runDowelDrillDepth({ dowelLengthMm: -8 }).ok).toBe(false);
  });

  it("rejects non-finite dowel lengths", () => {
    expect(runDowelDrillDepth({ dowelLengthMm: Number.NaN }).ok).toBe(false);
  });

  it("requires the dowel length", () => {
    expect(runDowelDrillDepth({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runDowelDrillDepth({ dowelLengthMm: 30, extra: true });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
