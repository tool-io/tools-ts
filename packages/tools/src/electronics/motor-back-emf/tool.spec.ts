import { describe, expect, it } from "vitest";
import {
  calculateMotorBackEmf,
  motorBackEmfExample,
  runMotorBackEmf,
} from "./tool.js";

describe("motor back emf", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMotorBackEmf(motorBackEmfExample.input)).toEqual({
      ok: true,
      output: motorBackEmfExample.output,
    });
  });

  it("defaults to a 100 rpm per volt constant", () => {
    expect(calculateMotorBackEmf({ rpmInt: 5000 })).toEqual({
      backEmfVolts: 50,
    });
    expect(runMotorBackEmf({ rpmInt: 3000 })).toEqual({
      ok: true,
      output: { backEmfVolts: 30 },
    });
  });

  it("scales linearly with speed for a fixed Kv", () => {
    const base = calculateMotorBackEmf({
      kvRpmPerVoltNumber: 650,
      rpmInt: 1000,
    }).backEmfVolts;
    expect(
      calculateMotorBackEmf({ kvRpmPerVoltNumber: 650, rpmInt: 4000 })
        .backEmfVolts,
    ).toBeCloseTo(base * 4, 12);
  });

  it("halves the back EMF when Kv doubles", () => {
    const slow = calculateMotorBackEmf({
      kvRpmPerVoltNumber: 500,
      rpmInt: 12000,
    }).backEmfVolts;
    const fast = calculateMotorBackEmf({
      kvRpmPerVoltNumber: 1000,
      rpmInt: 12000,
    }).backEmfVolts;
    expect(fast).toBeCloseTo(slow / 2, 15);
  });

  it("returns zero volts at standstill and accepts zero speed", () => {
    expect(calculateMotorBackEmf({ rpmInt: 0 }).backEmfVolts).toBe(0);
  });

  it("rejects negative speeds through execution", () => {
    expect(runMotorBackEmf({ rpmInt: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_rpm", field: "rpmInt" }] },
      ok: false,
    });
  });

  it("rejects non-positive Kv through execution", () => {
    expect(
      runMotorBackEmf({ kvRpmPerVoltNumber: 0, rpmInt: 10 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_kv", field: "kvRpmPerVoltNumber" }],
      },
      ok: false,
    });
  });
});
