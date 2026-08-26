import { describe, expect, it } from "vitest";
import { oxygenContentBloodExample, runOxygenContentBlood } from "./tool.js";

describe("O2 Content Blood", () => {
  it("publishes an executable example", () =>
    expect(runOxygenContentBlood(oxygenContentBloodExample.input)).toEqual({
      ok: true,
      output: oxygenContentBloodExample.output,
    }));
  it("computes canonical oxygen content", () =>
    expect(
      runOxygenContentBlood({
        hemoglobinGDl: 15,
        saturationFraction: 0.98,
        pao2Mmhg: 100,
      }),
    ).toEqual({ ok: true, output: { oxygenContentMlPerDL: 19.998 } }));
  it("handles zero saturation", () =>
    expect(
      runOxygenContentBlood({
        hemoglobinGDl: 15,
        saturationFraction: 0,
        pao2Mmhg: 100,
      }),
    ).toEqual({ ok: true, output: { oxygenContentMlPerDL: 0.3 } }));
  it("handles zero PaO2 at full saturation", () =>
    expect(
      runOxygenContentBlood({
        hemoglobinGDl: 14,
        saturationFraction: 1,
        pao2Mmhg: 0,
      }),
    ).toEqual({ ok: true, output: { oxygenContentMlPerDL: 18.76 } }));
  it("computes a mid-range result", () =>
    expect(
      runOxygenContentBlood({
        hemoglobinGDl: 10,
        saturationFraction: 0.5,
        pao2Mmhg: 50,
      }),
    ).toEqual({
      ok: true,
      output: { oxygenContentMlPerDL: 6.8500000000000005 },
    }));
  it("rejects zero hemoglobin", () => {
    const result = runOxygenContentBlood({
      hemoglobinGDl: 0,
      saturationFraction: 0.98,
      pao2Mmhg: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects saturation above one", () => {
    const result = runOxygenContentBlood({
      hemoglobinGDl: 15,
      saturationFraction: 1.5,
      pao2Mmhg: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative PaO2", () => {
    const result = runOxygenContentBlood({
      hemoglobinGDl: 15,
      saturationFraction: 0.98,
      pao2Mmhg: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
});
