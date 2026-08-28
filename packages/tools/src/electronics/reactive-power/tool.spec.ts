import { describe, expect, it } from "vitest";
import { runReactivePower } from "./tool.js";
describe("Reactive Power VAR", () => {
  it("calculates a valid result", () =>
    expect(
      runReactivePower({ ampsRms: 1, phaseDegrees: 90, voltsRms: 120 }),
    ).toEqual({
      ok: true,
      output: { reactivePowerVar: 120 },
    }));
  it("returns zero at zero phase", () =>
    expect(
      runReactivePower({ ampsRms: 2, phaseDegrees: 0, voltsRms: 100 }),
    ).toEqual({
      ok: true,
      output: { reactivePowerVar: 0 },
    }));
  it("returns negative values for negative phase", () => {
    const result = runReactivePower({
      ampsRms: 2,
      phaseDegrees: -30,
      voltsRms: 120,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.reactivePowerVar).toBeCloseTo(-120, 12);
  });
  it("supports negative voltage", () => {
    const result = runReactivePower({
      ampsRms: 1,
      phaseDegrees: 90,
      voltsRms: -100,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.reactivePowerVar).toBeLessThan(0);
  });
  it("rejects non-finite input", () =>
    expect(
      runReactivePower({
        ampsRms: Number.NaN,
        phaseDegrees: 90,
        voltsRms: 120,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runReactivePower({
      ampsRms: 1,
      extra: 3,
      phaseDegrees: 90,
      voltsRms: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runReactivePower({ ampsRms: 1, phaseDegrees: 90 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(
      runReactivePower({ ampsRms: true, phaseDegrees: 90, voltsRms: 2 }).ok,
    ).toBe(false));
});
