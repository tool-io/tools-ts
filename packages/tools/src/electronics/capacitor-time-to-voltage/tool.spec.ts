import { describe, expect, it } from "vitest";
import {
  capacitorTimeToVoltageExample,
  calculateCapacitorTimeToVoltage,
  runCapacitorTimeToVoltage,
} from "./tool.js";

describe("RC Time To Threshold", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapacitorTimeToVoltage(capacitorTimeToVoltageExample.input),
    ).toEqual({
      ok: true,
      output: capacitorTimeToVoltageExample.output,
    });
  });

  it("rejects unreachable target voltage", () => {
    expect(
      runCapacitorTimeToVoltage({
        capacitanceF: 1e-6,
        resistanceOhms: 10000,
        supplyVolts: 5,
        targetVolts: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unreachable_voltage" }] },
      ok: false,
    });
  });

  it("takes one time constant to reach 63.2 percent of supply", () => {
    const tau = 10000 * 1e-6;
    expect(
      calculateCapacitorTimeToVoltage({
        capacitanceF: 1e-6,
        resistanceOhms: 10000,
        supplyVolts: 5,
        targetVolts: 5 * (1 - Math.exp(-1)),
      }).timeSeconds,
    ).toBeCloseTo(tau, 12);
  });
});
