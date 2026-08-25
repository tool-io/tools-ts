import { describe, expect, it } from "vitest";
import { canopyHeightModelExample, runCanopyHeightModel } from "./tool.js";

describe("Canopy Height Difference", () => {
  it("matches the canonical example", () => {
    expect(runCanopyHeightModel(canopyHeightModelExample.input)).toEqual({
      ok: true,
      output: canopyHeightModelExample.output,
    });
  });

  it("reports zero height for bare ground", () => {
    expect(
      runCanopyHeightModel({
        maxSurfaceElevationMeters: 310,
        groundElevationMeters: 310,
      }),
    ).toEqual({ ok: true, output: { canopyHeightMeters: 0 } });
  });

  it("handles negative elevation terrain", () => {
    expect(
      runCanopyHeightModel({
        maxSurfaceElevationMeters: -12.25,
        groundElevationMeters: -20.75,
      }),
    ).toEqual({ ok: true, output: { canopyHeightMeters: 8.5 } });
  });

  it("measures tall emergent trees", () => {
    expect(
      runCanopyHeightModel({
        maxSurfaceElevationMeters: 645.3,
        groundElevationMeters: 600,
      }),
    ).toEqual({ ok: true, output: { canopyHeightMeters: 45.299999999999955 } });
  });

  it("rejects a surface below the ground with a stable code", () => {
    const result = runCanopyHeightModel({
      maxSurfaceElevationMeters: 100,
      groundElevationMeters: 120,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "negative_height",
        field: "maxSurfaceElevationMeters",
      });
  });

  it("rejects non finite elevations through the schema", () => {
    expect(
      runCanopyHeightModel({
        maxSurfaceElevationMeters: Number.POSITIVE_INFINITY,
        groundElevationMeters: 0,
      }).ok,
    ).toBe(false);
    expect(
      runCanopyHeightModel({
        maxSurfaceElevationMeters: 1,
        groundElevationMeters: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects non object input through the schema", () => {
    expect(runCanopyHeightModel([1, 2]).ok).toBe(false);
  });
});
