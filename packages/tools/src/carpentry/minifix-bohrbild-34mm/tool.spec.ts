import { describe, expect, it } from "vitest";
import { minifixPatternExample, runMinifixPattern } from "./tool.js";

describe("Minifix 34mm Drilling Pattern", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMinifixPattern(minifixPatternExample.input)).toEqual({
      ok: true,
      output: minifixPatternExample.output,
    });
  });

  it("returns the fixed pattern for class 16", () => {
    expect(runMinifixPattern({ panelThicknessClass: "16" })).toEqual({
      ok: true,
      output: {
        camHousingDepthMm: 12.5,
        camHousingDiameterMm: 15,
        lineBoringDistanceMm: 34,
        shaftDiameterMm: 8,
      },
    });
  });

  it("returns the fixed pattern for class 19", () => {
    expect(runMinifixPattern({ panelThicknessClass: "19" })).toEqual({
      ok: true,
      output: {
        camHousingDepthMm: 12.5,
        camHousingDiameterMm: 15,
        lineBoringDistanceMm: 34,
        shaftDiameterMm: 8,
      },
    });
  });

  it("keeps the pattern identical across every documented class", () => {
    for (const panelThicknessClass of ["16", "18", "19"] as const) {
      expect(runMinifixPattern({ panelThicknessClass })).toEqual({
        ok: true,
        output: minifixPatternExample.output,
      });
    }
  });

  it("rejects unknown classes", () => {
    const result = runMinifixPattern({ panelThicknessClass: "22" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.field).toBe("panelThicknessClass");
  });

  it("rejects numeric classes", () => {
    expect(runMinifixPattern({ panelThicknessClass: 18 }).ok).toBe(false);
  });

  it("requires the panel thickness class", () => {
    expect(runMinifixPattern({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runMinifixPattern({
      extra: true,
      panelThicknessClass: "18",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
