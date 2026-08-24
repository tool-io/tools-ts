import { describe, expect, it } from "vitest";
import { runWaferBow, waferBowExample } from "./tool.js";

describe("wafer bow sagitta", () => {
  it("reproduces the documented example", () =>
    expect(runWaferBow(waferBowExample.input)).toEqual({
      ok: true,
      output: waferBowExample.output,
    }));
  it("remains accurate for a nearly flat wafer", () => {
    const result = runWaferBow({
      curvatureRadiusMeters: 1e12,
      waferDiameterMm: 300,
    });
    expect(result.ok && result.output.bowUm).toBeGreaterThan(0);
  });
  it("rejects a radius smaller than the half chord", () =>
    expect(
      runWaferBow({ curvatureRadiusMeters: 0.1, waferDiameterMm: 300 }),
    ).toMatchObject({ ok: false }));
});
