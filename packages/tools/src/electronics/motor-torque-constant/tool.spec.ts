import { describe, expect, it } from "vitest";
import {
  calculateMotorTorqueConstant,
  motorTorqueConstantExample,
  runMotorTorqueConstant,
} from "./tool.js";

describe("motor torque constant", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMotorTorqueConstant(motorTorqueConstantExample.input)).toEqual({
      ok: true,
      output: motorTorqueConstantExample.output,
    });
  });

  it("inverts the Kv relationship between Kt and sixty over two pi", () => {
    expect(
      calculateMotorTorqueConstant({ kvRpmPerVolt: 60 / (2 * Math.PI) })
        .torqueConstantNmPerA,
    ).toBeCloseTo(1, 15);
  });

  it("halves Kt when Kv doubles", () => {
    const low = calculateMotorTorqueConstant({
      kvRpmPerVolt: 500,
    }).torqueConstantNmPerA;
    const high = calculateMotorTorqueConstant({
      kvRpmPerVolt: 1000,
    }).torqueConstantNmPerA;
    expect(high).toBeCloseTo(low / 2, 15);
  });

  it("matches the documented formula for a 2300 Kv motor", () => {
    expect(
      calculateMotorTorqueConstant({ kvRpmPerVolt: 2300 }).torqueConstantNmPerA,
    ).toBe(60 / (2 * Math.PI * 2300));
  });

  it("rejects non-positive Kv through execution", () => {
    expect(runMotorTorqueConstant({ kvRpmPerVolt: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_kv", field: "kvRpmPerVolt" }] },
      ok: false,
    });
    expect(runMotorTorqueConstant({ kvRpmPerVolt: -100 })).toMatchObject({
      error: { issues: [{ code: "invalid_kv", field: "kvRpmPerVolt" }] },
      ok: false,
    });
  });

  it("keeps high torque constants for gimbal class motors", () => {
    expect(
      calculateMotorTorqueConstant({ kvRpmPerVolt: 50 }).torqueConstantNmPerA,
    ).toBeGreaterThan(0.1);
  });
});
