import { describe, expect, it } from "vitest";
import { cellSeedingDensityExample, runCellSeedingDensity } from "./tool.js";

describe("Seeding Density", () => {
  it("matches the canonical example", () => {
    expect(runCellSeedingDensity(cellSeedingDensityExample.input)).toEqual({
      ok: true,
      output: cellSeedingDensityExample.output,
    });
  });
  it("divides cells by area", () =>
    expect(
      runCellSeedingDensity({ cellCount: 1200, growthAreaCm2: 4 }),
    ).toEqual({ ok: true, output: { seedingDensityPerCm2: 300 } }));
  it("handles fractional areas", () =>
    expect(
      runCellSeedingDensity({ cellCount: 100, growthAreaCm2: 0.5 }),
    ).toEqual({ ok: true, output: { seedingDensityPerCm2: 200 } }));
  it("allows a zero cell count", () =>
    expect(runCellSeedingDensity({ cellCount: 0, growthAreaCm2: 10 })).toEqual({
      ok: true,
      output: { seedingDensityPerCm2: 0 },
    }));
  it("rejects zero area", () =>
    expect(runCellSeedingDensity({ cellCount: 100, growthAreaCm2: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative area", () =>
    expect(
      runCellSeedingDensity({ cellCount: 100, growthAreaCm2: -3 }).ok,
    ).toBe(false));
  it("rejects negative cell counts", () =>
    expect(runCellSeedingDensity({ cellCount: -1, growthAreaCm2: 5 }).ok).toBe(
      false,
    ));
});
