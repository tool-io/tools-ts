import { describe, expect, it } from "vitest";
import { runCurrentSensePower } from "./tool.js";

describe("Shunt Power", () => {
  it("calculates a valid result", () =>
    expect(
      runCurrentSensePower({
        senseCurrentAmps: 0.005,
        shuntResistanceMilliohms: 100,
      }),
    ).toEqual({
      ok: true,
      output: { shuntPowerMw: 0.0025 },
    }));
  it("grows with the square of current", () =>
    expect(
      runCurrentSensePower({
        senseCurrentAmps: 0.01,
        shuntResistanceMilliohms: 100,
      }),
    ).toEqual({
      ok: true,
      output: { shuntPowerMw: 0.01 },
    }));
  it("scales linearly with resistance", () =>
    expect(
      runCurrentSensePower({
        senseCurrentAmps: 0.005,
        shuntResistanceMilliohms: 300,
      }),
    ).toEqual({
      ok: true,
      output: { shuntPowerMw: 0.007500000000000001 },
    }));
  it("handles binary-exact inputs", () =>
    expect(
      runCurrentSensePower({
        senseCurrentAmps: 0.125,
        shuntResistanceMilliohms: 64,
      }),
    ).toEqual({
      ok: true,
      output: { shuntPowerMw: 1 },
    }));
  it("rejects zero current", () =>
    expect(
      runCurrentSensePower({
        senseCurrentAmps: 0,
        shuntResistanceMilliohms: 100,
      }).ok,
    ).toBe(false));
  it("rejects negative current", () =>
    expect(
      runCurrentSensePower({
        senseCurrentAmps: -1,
        shuntResistanceMilliohms: 100,
      }).ok,
    ).toBe(false));
  it("rejects zero resistance", () =>
    expect(
      runCurrentSensePower({
        senseCurrentAmps: 0.005,
        shuntResistanceMilliohms: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative resistance", () =>
    expect(
      runCurrentSensePower({
        senseCurrentAmps: 0.005,
        shuntResistanceMilliohms: -50,
      }).ok,
    ).toBe(false));
});
