import { describe, expect, it } from "vitest";
import { runI2cPullupResistorMax } from "./tool.js";
describe("I2C Pullup Max", () => {
  it("calculates standard-mode maximum pull-up", () =>
    expect(
      runI2cPullupResistorMax({ busCapacitancePf: 100, riseTimeNs: 1000 }),
    ).toEqual({
      ok: true,
      output: { maxPullupOhms: 11802.195208308745 },
    }));
  it("calculates fast-mode maximum pull-up", () =>
    expect(
      runI2cPullupResistorMax({ busCapacitancePf: 400, riseTimeNs: 300 }),
    ).toEqual({
      ok: true,
      output: { maxPullupOhms: 885.164640623156 },
    }));
  it("doubles when the rise time doubles", () =>
    expect(
      runI2cPullupResistorMax({ busCapacitancePf: 100, riseTimeNs: 2000 }),
    ).toEqual({
      ok: true,
      output: { maxPullupOhms: 23604.39041661749 },
    }));
  it("rejects a zero rise time", () =>
    expect(
      runI2cPullupResistorMax({ busCapacitancePf: 100, riseTimeNs: 0 }).ok,
    ).toBe(false));
  it("rejects a negative rise time", () =>
    expect(
      runI2cPullupResistorMax({ busCapacitancePf: 100, riseTimeNs: -1 }).ok,
    ).toBe(false));
  it("rejects zero bus capacitance", () =>
    expect(
      runI2cPullupResistorMax({ busCapacitancePf: 0, riseTimeNs: 300 }).ok,
    ).toBe(false));
  it("rejects negative bus capacitance", () =>
    expect(
      runI2cPullupResistorMax({ busCapacitancePf: -50, riseTimeNs: 300 }).ok,
    ).toBe(false));
});
