import { describe, expect, it } from "vitest";
import { canopyBulkDensityExample, runCanopyBulkDensity } from "./tool.js";

describe("Canopy Bulk Density", () => {
  it("publishes an executable example", () =>
    expect(runCanopyBulkDensity(canopyBulkDensityExample.input)).toEqual({
      ok: true,
      output: canopyBulkDensityExample.output,
    }));
  it("returns zero for an empty canopy", () =>
    expect(
      runCanopyBulkDensity({ canopyFuelMassKg: 0, canopyVolumeM3: 400 }),
    ).toEqual({ ok: true, output: { canopyBulkDensityKgM3: 0 } }));
  it("doubles when fuel mass doubles at fixed volume", () =>
    expect(
      runCanopyBulkDensity({ canopyFuelMassKg: 240, canopyVolumeM3: 400 }),
    ).toEqual({ ok: true, output: { canopyBulkDensityKgM3: 0.6 } }));
  it("rises as the canopy volume shrinks", () =>
    expect(
      runCanopyBulkDensity({ canopyFuelMassKg: 120, canopyVolumeM3: 200 }),
    ).toEqual({ ok: true, output: { canopyBulkDensityKgM3: 0.6 } }));
  it("keeps fractional densities exact", () =>
    expect(
      runCanopyBulkDensity({ canopyFuelMassKg: 100, canopyVolumeM3: 800 }),
    ).toEqual({ ok: true, output: { canopyBulkDensityKgM3: 0.125 } }));
  it("rejects zero canopy volume", () => {
    const result = runCanopyBulkDensity({
      canopyFuelMassKg: 120,
      canopyVolumeM3: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("canopyVolumeM3");
  });
  it("rejects negative fuel masses", () => {
    const result = runCanopyBulkDensity({
      canopyFuelMassKg: -1,
      canopyVolumeM3: 400,
    });
    expect(result.ok).toBe(false);
  });
});
