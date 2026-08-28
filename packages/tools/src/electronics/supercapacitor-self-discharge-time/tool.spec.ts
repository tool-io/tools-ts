import { describe, expect, it } from "vitest";
import {
  calculateSupercapacitorSelfDischargeTime,
  runSupercapacitorSelfDischargeTime,
  supercapacitorSelfDischargeTimeExample,
} from "./tool.js";

describe("Supercap Self-Discharge Time", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSupercapacitorSelfDischargeTime(
        supercapacitorSelfDischargeTimeExample.input,
      ),
    ).toEqual({
      ok: true,
      output: supercapacitorSelfDischargeTimeExample.output,
    });
  });

  it("matches one time constant for a decade of decay", () => {
    const days = calculateSupercapacitorSelfDischargeTime({
      leakageTimeConstantHours: 2400,
      vAcceptable: 1.35,
      vCharged: 2.7,
    }).selfDischargeDays;
    expect(days).toBe(34.657359027997266 * 2);
  });

  it("reports zero days when charged at the acceptable voltage", () => {
    const result = runSupercapacitorSelfDischargeTime({
      leakageTimeConstantHours: 1200,
      vAcceptable: 2.7,
      vCharged: 2.7000000000000005,
    });
    expect(result).toMatchObject({ ok: true });
  });

  it("scales linearly with the time constant", () => {
    const a = calculateSupercapacitorSelfDischargeTime({
      leakageTimeConstantHours: 500,
      vAcceptable: 1,
      vCharged: 2,
    }).selfDischargeDays;
    const b = calculateSupercapacitorSelfDischargeTime({
      leakageTimeConstantHours: 1500,
      vAcceptable: 1,
      vCharged: 2,
    }).selfDischargeDays;
    expect(b).toBeCloseTo(a * 3, 12);
  });

  it("rejects a non-positive time constant via invalid_time_constant", () => {
    expect(
      runSupercapacitorSelfDischargeTime({
        leakageTimeConstantHours: 0,
        vAcceptable: 1,
        vCharged: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_time_constant", field: "leakageTimeConstantHours" },
        ],
      },
      ok: false,
    });
  });

  it("rejects non-positive voltages via invalid_voltages", () => {
    expect(
      runSupercapacitorSelfDischargeTime({
        leakageTimeConstantHours: 100,
        vAcceptable: 0,
        vCharged: 2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltages", field: "vCharged" }] },
      ok: false,
    });
  });

  it("rejects a charged voltage at or below acceptable via invalid_voltages", () => {
    expect(
      runSupercapacitorSelfDischargeTime({
        leakageTimeConstantHours: 100,
        vAcceptable: 2.7,
        vCharged: 2.7,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltages", field: "vCharged" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(
      runSupercapacitorSelfDischargeTime({ vCharged: 2, vAcceptable: 1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "leakageTimeConstantHours" }],
      },
      ok: false,
    });
  });
});
