import { describe, expect, it } from "vitest";
import { runOsmoticPressure, osmoticPressureExample } from "./tool.js";
describe("Osmotic Pressure Calculator", () => {
  it("publishes an executable example", () =>
    expect(runOsmoticPressure(osmoticPressureExample.input)).toEqual({
      ok: true,
      output: osmoticPressureExample.output,
    }));
  it("defaults to a van 't Hoff factor of one", () =>
    expect(runOsmoticPressure({ molarityM: 0.5, temperatureK: 300 })).toEqual({
      ok: true,
      output: { osmoticPressureAtm: 12.308604912143998 },
    }));
  it("scales linearly with molarity", () => {
    const dilute = runOsmoticPressure({ molarityM: 1, temperatureK: 300 });
    const concentrated = runOsmoticPressure({
      molarityM: 2,
      temperatureK: 300,
    });
    expect(dilute.ok).toBe(true);
    expect(concentrated.ok).toBe(true);
    if (dilute.ok && concentrated.ok)
      expect(
        Number(concentrated.output.osmoticPressureAtm) /
          Number(dilute.output.osmoticPressureAtm),
      ).toBe(2);
  });
  it("doubles when temperature doubles", () => {
    const baseline = runOsmoticPressure({ molarityM: 0.5, temperatureK: 300 });
    const warmer = runOsmoticPressure({ molarityM: 0.5, temperatureK: 600 });
    expect(baseline.ok).toBe(true);
    expect(warmer.ok).toBe(true);
    if (baseline.ok && warmer.ok)
      expect(
        Number(warmer.output.osmoticPressureAtm) /
          Number(baseline.output.osmoticPressureAtm),
      ).toBe(2);
  });
  it("rejects zero molarity", () =>
    expect(runOsmoticPressure({ molarityM: 0, temperatureK: 300 }).ok).toBe(
      false,
    ));
  it("rejects zero temperature", () =>
    expect(runOsmoticPressure({ molarityM: 0.5, temperatureK: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative temperature", () =>
    expect(
      runOsmoticPressure({ molarityM: 0.5, temperatureK: -273.15 }).ok,
    ).toBe(false));
});
