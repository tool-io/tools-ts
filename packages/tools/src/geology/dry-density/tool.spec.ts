import { describe, expect, it } from "vitest";
import { dryDensityExample, runDryDensity } from "./tool.js";

describe("dry-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDryDensity(dryDensityExample.input)).toEqual({
      ok: true,
      output: dryDensityExample.output,
    });
  });

  it("equals bulk density at zero water content", () => {
    const result = runDryDensity({
      bulkDensityKgPerM3: 1800,
      waterContentFraction: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dryDensityKgPerM3 as number).toBe(1800);
  });
  it("rejects negative water contents", () => {
    expect(
      runDryDensity({ bulkDensityKgPerM3: 2100, waterContentFraction: -0.1 })
        .ok,
    ).toBe(false);
  });
});
