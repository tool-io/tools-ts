import { describe, expect, it } from "vitest";
import { runTheveninVoltage } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runTheveninVoltage>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runTheveninVoltage>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Thevenin Voltage", () => {
  it("computes the Thevenin voltage of a divider", () =>
    expect(
      runTheveninVoltage({ r1Ohms: 1000, r2Ohms: 2000, supplyVolts: 12 }),
    ).toEqual({ ok: true, output: { theveninVoltage: 8 } }));
  it("computes the midpoint of an equal divider", () =>
    expect(
      output(
        runTheveninVoltage({ r1Ohms: 10000, r2Ohms: 10000, supplyVolts: 5 }),
      ).theveninVoltage,
    ).toBeCloseTo(2.5, 9));
  it("computes the Thevenin voltage for unequal resistors", () =>
    expect(
      output(runTheveninVoltage({ r1Ohms: 4700, r2Ohms: 1000, supplyVolts: 9 }))
        .theveninVoltage,
    ).toBeCloseTo(1.5789473684210527, 9));
  it("rejects a zero supply voltage", () => {
    const result = runTheveninVoltage({
      r1Ohms: 1000,
      r2Ohms: 2000,
      supplyVolts: 0,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a zero R1", () =>
    expect(
      runTheveninVoltage({ r1Ohms: 0, r2Ohms: 2000, supplyVolts: 12 }).ok,
    ).toBe(false));
  it("rejects a zero R2", () => {
    const result = runTheveninVoltage({
      r1Ohms: 1000,
      r2Ohms: 0,
      supplyVolts: 12,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative R2", () =>
    expect(
      runTheveninVoltage({ r1Ohms: 1000, r2Ohms: -2000, supplyVolts: 12 }).ok,
    ).toBe(false));
});
