import { describe, expect, it } from "vitest";
import { rootLengthDensityExample, runRootLengthDensity } from "./tool.js";

describe("Root Length Density", () => {
  it("publishes an executable example", () =>
    expect(runRootLengthDensity(rootLengthDensityExample.input)).toEqual({
      ok: true,
      output: rootLengthDensityExample.output,
    }));
  it("rises in proportion to root length", () =>
    expect(
      runRootLengthDensity({ rootLengthCm: 200, soilVolumeCm3: 40 }),
    ).toEqual({ ok: true, output: { rootLengthDensity: 5 } }));
  it("rises as the sampled soil volume shrinks", () =>
    expect(
      runRootLengthDensity({ rootLengthCm: 100, soilVolumeCm3: 20 }),
    ).toEqual({ ok: true, output: { rootLengthDensity: 5 } }));
  it("keeps fractional densities exact", () =>
    expect(
      runRootLengthDensity({ rootLengthCm: 10, soilVolumeCm3: 8 }),
    ).toEqual({ ok: true, output: { rootLengthDensity: 1.25 } }));
  it("rejects zero root length", () => {
    const result = runRootLengthDensity({
      rootLengthCm: 0,
      soilVolumeCm3: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("rootLengthCm");
  });
  it("rejects zero soil volume", () => {
    const result = runRootLengthDensity({
      rootLengthCm: 100,
      soilVolumeCm3: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("soilVolumeCm3");
  });
  it("rejects negative volumes", () => {
    const result = runRootLengthDensity({
      rootLengthCm: 100,
      soilVolumeCm3: -40,
    });
    expect(result.ok).toBe(false);
  });
});
