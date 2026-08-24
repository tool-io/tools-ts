import { describe, expect, it } from "vitest";
import { runSurfacePotential, surfacePotentialExample } from "./tool.js";

describe("strong-inversion surface potential", () => {
  it("reproduces the documented example", () =>
    expect(runSurfacePotential(surfacePotentialExample.input)).toEqual({
      ok: true,
      output: surfacePotentialExample.output,
    }));
  it("scales linearly with temperature when concentrations are held fixed", () => {
    const result = runSurfacePotential({
      dopingPerCm3: 1e17,
      intrinsicConc: 1e10,
      temperatureKelvin: 600,
    });
    expect(result.ok && result.output.surfacePotentialVolts).toBeCloseTo(
      2 * surfacePotentialExample.output.surfacePotentialVolts,
      12,
    );
  });
  it("rejects a non-extrinsic concentration ratio", () =>
    expect(
      runSurfacePotential({ dopingPerCm3: 1e10, intrinsicConc: 1e10 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "not_extrinsic" }] },
    }));
});
