import { describe, expect, it } from "vitest";
import { runStomatalDensity, stomatalDensityExample } from "./tool.js";

describe("Stomatal Density", () => {
  it("publishes an executable example", () =>
    expect(runStomatalDensity(stomatalDensityExample.input)).toEqual({
      ok: true,
      output: stomatalDensityExample.output,
    }));
  it("returns zero when no stomata are counted", () =>
    expect(
      runStomatalDensity({ fieldAreaMm2: 0.5, stomataCountedInt: 0 }),
    ).toEqual({ ok: true, output: { stomatalDensityPerMm2: 0 } }));
  it("doubles when counts double at fixed area", () =>
    expect(
      runStomatalDensity({ fieldAreaMm2: 0.25, stomataCountedInt: 90 }),
    ).toEqual({ ok: true, output: { stomatalDensityPerMm2: 360 } }));
  it("falls as the field area grows", () =>
    expect(
      runStomatalDensity({ fieldAreaMm2: 0.5, stomataCountedInt: 45 }),
    ).toEqual({ ok: true, output: { stomatalDensityPerMm2: 90 } }));
  it("keeps fractional densities exact", () =>
    expect(
      runStomatalDensity({ fieldAreaMm2: 4, stomataCountedInt: 10 }),
    ).toEqual({ ok: true, output: { stomatalDensityPerMm2: 2.5 } }));
  it("rejects a zero field area", () => {
    const result = runStomatalDensity({
      fieldAreaMm2: 0,
      stomataCountedInt: 45,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("fieldAreaMm2");
  });
  it("rejects negative counts", () => {
    const result = runStomatalDensity({
      fieldAreaMm2: 0.25,
      stomataCountedInt: -1,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects non-integer counts", () => {
    const result = runStomatalDensity({
      fieldAreaMm2: 0.25,
      stomataCountedInt: 45.5,
    });
    expect(result.ok).toBe(false);
  });
});
