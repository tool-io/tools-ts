import { describe, expect, it } from "vitest";
import {
  calculateShotNoiseVoltage,
  runShotNoiseVoltage,
  shotNoiseVoltageExample,
} from "./tool.js";

describe("Shot Noise Voltage", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runShotNoiseVoltage(shotNoiseVoltageExample.input)).toEqual({
      ok: true,
      output: shotNoiseVoltageExample.output,
    });
  });

  it("equals the shot current times the load in microvolts", () => {
    expect(
      runShotNoiseVoltage({
        averageCurrentAmps: 0.002,
        bandwidthHz: 4000000,
        loadResistanceOhms: 100,
      }),
    ).toEqual({
      ok: true,
      output: {
        shotNoiseVoltageUv:
          Math.sqrt(2 * 1.602176634e-19 * 0.002 * 4000000) * 100 * 1e6,
      },
    });
  });

  it("scales linearly with load resistance", () => {
    expect(
      calculateShotNoiseVoltage({
        ...shotNoiseVoltageExample.input,
        loadResistanceOhms: 500,
      }).shotNoiseVoltageUv,
    ).toBeCloseTo(10 * 0.8950353719267188, 12);
  });

  it("matches the underlying current-noise formula", () => {
    expect(
      calculateShotNoiseVoltage({
        averageCurrentAmps: 1e-6,
        bandwidthHz: 1,
        loadResistanceOhms: 1000000,
      }).shotNoiseVoltageUv,
    ).toBe(Math.sqrt(2 * 1.602176634e-19 * 1e-6) * 1000000 * 1e6);
  });

  it("rejects non-positive current or bandwidth", () => {
    expect(
      runShotNoiseVoltage({
        ...shotNoiseVoltageExample.input,
        averageCurrentAmps: 0,
      }).ok,
    ).toBe(false);
    expect(
      runShotNoiseVoltage({ ...shotNoiseVoltageExample.input, bandwidthHz: 0 })
        .ok,
    ).toBe(false);
  });

  it("rejects non-positive load resistance", () => {
    expect(
      runShotNoiseVoltage({
        ...shotNoiseVoltageExample.input,
        loadResistanceOhms: 0,
      }).ok,
    ).toBe(false);
  });
});
