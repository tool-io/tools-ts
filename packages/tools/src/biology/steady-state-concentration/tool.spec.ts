import { describe, expect, it } from "vitest";
import { runSteadyStateConcentration } from "./tool.js";

describe("Steady-State Concentration", () => {
  it("calculates a valid result", () =>
    expect(
      runSteadyStateConcentration({ clearanceLPerHour: 2, doseMgPerHour: 10 }),
    ).toEqual({
      ok: true,
      output: { steadyStateConcentrationMgPerL: 5 },
    }));
  it("defaults to full bioavailability", () => {
    const result = runSteadyStateConcentration({
      bioavailabilityFraction: 1,
      clearanceLPerHour: 2,
      doseMgPerHour: 10,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.steadyStateConcentrationMgPerL).toBe(5);
  });
  it("reduces exposure for partial bioavailability", () =>
    expect(
      runSteadyStateConcentration({
        bioavailabilityFraction: 0.4,
        clearanceLPerHour: 2,
        doseMgPerHour: 10,
      }),
    ).toEqual({
      ok: true,
      output: { steadyStateConcentrationMgPerL: 2 },
    }));
  it("scales linearly with the dose rate", () => {
    const result = runSteadyStateConcentration({
      clearanceLPerHour: 4,
      doseMgPerHour: 24,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.steadyStateConcentrationMgPerL).toBe(6);
  });
  it("falls inversely with clearance", () => {
    const result = runSteadyStateConcentration({
      clearanceLPerHour: 5,
      doseMgPerHour: 15,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.steadyStateConcentrationMgPerL).toBe(3);
  });
  it("rejects a zero dose rate", () => {
    const result = runSteadyStateConcentration({
      clearanceLPerHour: 2,
      doseMgPerHour: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dose_rate");
  });
  it("rejects a zero clearance", () => {
    const result = runSteadyStateConcentration({
      clearanceLPerHour: 0,
      doseMgPerHour: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_clearance");
  });
  it("rejects fractions above one", () =>
    expect(
      runSteadyStateConcentration({
        bioavailabilityFraction: 1.5,
        clearanceLPerHour: 2,
        doseMgPerHour: 10,
      }).ok,
    ).toBe(false));
});
