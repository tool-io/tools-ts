import { describe, expect, it } from "vitest";
import { calculateVcoGain, runVcoGain, vcoGainExample } from "./tool.js";

describe("VCO Gain", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVcoGain(vcoGainExample.input)).toEqual({
      ok: true,
      output: vcoGainExample.output,
    });
  });

  it("doubles gain when deviation doubles over the same tuning span", () => {
    const base = calculateVcoGain({
      controlVoltageRangeVolts: 2,
      frequencyDeviationHz: 40000000,
    }).vcoGainHzPerVolt;
    expect(base).toBe(20000000);
    expect(
      calculateVcoGain({
        controlVoltageRangeVolts: 2,
        frequencyDeviationHz: 80000000,
      }).vcoGainHzPerVolt,
    ).toBe(base * 2);
  });

  it("halves gain when the control voltage range doubles", () => {
    const base = calculateVcoGain({
      controlVoltageRangeVolts: 3,
      frequencyDeviationHz: 60000000,
    }).vcoGainHzPerVolt;
    expect(
      calculateVcoGain({
        controlVoltageRangeVolts: 6,
        frequencyDeviationHz: 60000000,
      }).vcoGainHzPerVolt,
    ).toBe(base / 2);
  });

  it("expresses megahertz-per-volt tuning in SI units", () => {
    expect(
      calculateVcoGain({
        controlVoltageRangeVolts: 3.3,
        frequencyDeviationHz: 33000000,
      }).vcoGainHzPerVolt,
    ).toBeCloseTo(10000000, 6);
  });

  it("rejects zero frequency deviation with a stable code", () => {
    expect(
      runVcoGain({ controlVoltageRangeVolts: 5, frequencyDeviationHz: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_frequency", field: "frequencyDeviationHz" }],
      },
      ok: false,
    });
  });

  it("rejects zero control voltage range with a stable code", () => {
    expect(
      runVcoGain({ controlVoltageRangeVolts: 0, frequencyDeviationHz: 1000 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_voltage", field: "controlVoltageRangeVolts" },
        ],
      },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runVcoGain({ frequencyDeviationHz: 1000 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "controlVoltageRangeVolts" }],
      },
      ok: false,
    });
  });
});
