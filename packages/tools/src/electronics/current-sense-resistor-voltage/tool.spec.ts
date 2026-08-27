import { describe, expect, it } from "vitest";
import { runCurrentSenseResistorVoltage } from "./tool.js";

describe("Sense Voltage", () => {
  it("calculates a valid result", () =>
    expect(
      runCurrentSenseResistorVoltage({
        senseCurrentAmps: 0.005,
        shuntResistanceMilliohms: 100,
      }),
    ).toEqual({
      ok: true,
      output: { senseVoltageMv: 0.5 },
    }));
  it("scales linearly with current", () =>
    expect(
      runCurrentSenseResistorVoltage({
        senseCurrentAmps: 0.01,
        shuntResistanceMilliohms: 100,
      }),
    ).toEqual({
      ok: true,
      output: { senseVoltageMv: 1 },
    }));
  it("scales linearly with resistance", () =>
    expect(
      runCurrentSenseResistorVoltage({
        senseCurrentAmps: 0.005,
        shuntResistanceMilliohms: 200,
      }),
    ).toEqual({
      ok: true,
      output: { senseVoltageMv: 1 },
    }));
  it("handles small shunts and large currents", () =>
    expect(
      runCurrentSenseResistorVoltage({
        senseCurrentAmps: 0.02,
        shuntResistanceMilliohms: 5,
      }),
    ).toEqual({
      ok: true,
      output: { senseVoltageMv: 0.1 },
    }));
  it("rejects zero current", () =>
    expect(
      runCurrentSenseResistorVoltage({
        senseCurrentAmps: 0,
        shuntResistanceMilliohms: 100,
      }).ok,
    ).toBe(false));
  it("rejects negative current", () =>
    expect(
      runCurrentSenseResistorVoltage({
        senseCurrentAmps: -0.005,
        shuntResistanceMilliohms: 100,
      }).ok,
    ).toBe(false));
  it("rejects zero resistance", () =>
    expect(
      runCurrentSenseResistorVoltage({
        senseCurrentAmps: 0.005,
        shuntResistanceMilliohms: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative resistance", () =>
    expect(
      runCurrentSenseResistorVoltage({
        senseCurrentAmps: 0.005,
        shuntResistanceMilliohms: -100,
      }).ok,
    ).toBe(false));
});
