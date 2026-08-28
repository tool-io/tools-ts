import { describe, expect, it } from "vitest";
import { runMaxPowerDelivered } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runMaxPowerDelivered>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runMaxPowerDelivered>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Max Power Delivered", () => {
  it("computes the maximum power for a matched load", () =>
    expect(
      runMaxPowerDelivered({ theveninResistanceOhms: 50, theveninVoltage: 10 }),
    ).toEqual({ ok: true, output: { maxPowerWatts: 0.5 } }));
  it("computes the maximum power for an equal-Volt-equal-Ohm source", () =>
    expect(
      runMaxPowerDelivered({ theveninResistanceOhms: 8, theveninVoltage: 8 }),
    ).toEqual({ ok: true, output: { maxPowerWatts: 2 } }));
  it("computes the maximum power for a high-impedance source", () =>
    expect(
      output(
        runMaxPowerDelivered({
          theveninResistanceOhms: 25,
          theveninVoltage: 1,
        }),
      ).maxPowerWatts,
    ).toBeCloseTo(0.01, 12));
  it("rejects a zero Thevenin voltage", () => {
    const result = runMaxPowerDelivered({
      theveninResistanceOhms: 50,
      theveninVoltage: 0,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative Thevenin voltage", () =>
    expect(
      runMaxPowerDelivered({ theveninResistanceOhms: 50, theveninVoltage: -10 })
        .ok,
    ).toBe(false));
  it("rejects a zero Thevenin resistance", () => {
    const result = runMaxPowerDelivered({
      theveninResistanceOhms: 0,
      theveninVoltage: 10,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative Thevenin resistance", () =>
    expect(
      runMaxPowerDelivered({ theveninResistanceOhms: -50, theveninVoltage: 10 })
        .ok,
    ).toBe(false));
});
