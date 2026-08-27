import { describe, expect, it } from "vitest";
import {
  calculateChargeOnCapacitor,
  chargeOnCapacitorExample,
  runChargeOnCapacitor,
} from "./tool.js";

describe("charge on capacitor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runChargeOnCapacitor(chargeOnCapacitorExample.input)).toEqual({
      ok: true,
      output: chargeOnCapacitorExample.output,
    });
  });

  it("starts at zero and approaches full charge CV", () => {
    const { capacitanceF, resistanceOhms, supplyVoltageV } =
      chargeOnCapacitorExample.input;
    expect(
      calculateChargeOnCapacitor({
        capacitanceF,
        resistanceOhms,
        supplyVoltageV,
        timeS: 0,
      }).chargeC,
    ).toBe(0);
    const settled = calculateChargeOnCapacitor({
      capacitanceF,
      resistanceOhms,
      supplyVoltageV,
      timeS: 1,
    }).chargeC;
    // After ten time constants the shortfall from CV is under one percent.
    const shortfall = capacitanceF * supplyVoltageV - settled;
    expect(shortfall).toBeGreaterThan(0);
    expect(shortfall).toBeLessThan(0.01 * capacitanceF * supplyVoltageV);
  });

  it("rejects invalid inputs through execution", () => {
    for (const bad of [
      { capacitanceF: 0, resistanceOhms: 1000, supplyVoltageV: 9, timeS: 0.1 },
      {
        capacitanceF: 1e-4,
        resistanceOhms: 1000,
        supplyVoltageV: 9,
        timeS: -1,
      },
    ])
      expect(runChargeOnCapacitor(bad).ok).toBe(false);
  });
});
