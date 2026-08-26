import { describe, expect, it } from "vitest";
import { oxygenationIndexExample, runOxygenationIndex } from "./tool.js";

describe("Oxygenation Index OI", () => {
  it("publishes an executable example", () =>
    expect(runOxygenationIndex(oxygenationIndexExample.input)).toEqual({
      ok: true,
      output: oxygenationIndexExample.output,
    }));
  it("computes a low index", () =>
    expect(
      runOxygenationIndex({
        fiO2Fraction: 0.21,
        meanAirwayPressureCmH2o: 8,
        pao2Mmhg: 90,
      }),
    ).toEqual({
      ok: true,
      output: { oxygenationIndex: 1.8666666666666667 },
    }));
  it("computes a severe index", () =>
    expect(
      runOxygenationIndex({
        fiO2Fraction: 0.8,
        meanAirwayPressureCmH2o: 20,
        pao2Mmhg: 50,
      }),
    ).toEqual({ ok: true, output: { oxygenationIndex: 32 } }));
  it("keeps fractional precision", () =>
    expect(
      runOxygenationIndex({
        fiO2Fraction: 0.3,
        meanAirwayPressureCmH2o: 10,
        pao2Mmhg: 60,
      }),
    ).toEqual({ ok: true, output: { oxygenationIndex: 5 } }));
  it("rejects non-positive mean airway pressure", () => {
    const result = runOxygenationIndex({
      fiO2Fraction: 0.5,
      meanAirwayPressureCmH2o: 0,
      pao2Mmhg: 80,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("meanAirwayPressureCmH2o");
  });
  it("rejects zero PaO2", () => {
    const result = runOxygenationIndex({
      fiO2Fraction: 0.5,
      meanAirwayPressureCmH2o: 12,
      pao2Mmhg: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("pao2Mmhg");
  });
  it("rejects zero FiO2", () => {
    const result = runOxygenationIndex({
      fiO2Fraction: 0,
      meanAirwayPressureCmH2o: 12,
      pao2Mmhg: 80,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects unitary FiO2", () => {
    const result = runOxygenationIndex({
      fiO2Fraction: 1,
      meanAirwayPressureCmH2o: 12,
      pao2Mmhg: 80,
    });
    expect(result.ok).toBe(false);
  });
});
