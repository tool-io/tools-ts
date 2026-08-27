import { describe, expect, it } from "vitest";
import {
  calculateDecibelPowerRatio,
  decibelPowerRatioExample,
  runDecibelPowerRatio,
} from "./tool.js";

describe("decibel power ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDecibelPowerRatio(decibelPowerRatioExample.input)).toEqual({
      ok: true,
      output: decibelPowerRatioExample.output,
    });
  });

  it("gives 0 dB for equal powers and -10 dB for a tenth", () => {
    expect(
      calculateDecibelPowerRatio({
        measuredPowerW: 5,
        referencePowerW: 5,
      }).decibelsDb,
    ).toBe(0);
    expect(
      calculateDecibelPowerRatio({
        measuredPowerW: 0.1,
        referencePowerW: 1,
      }).decibelsDb,
    ).toBe(-10);
    expect(
      calculateDecibelPowerRatio({
        measuredPowerW: 100,
        referencePowerW: 1,
      }).decibelsDb,
    ).toBe(20);
  });

  it("rejects non-positive power levels through execution", () => {
    for (const bad of [
      { measuredPowerW: 10, referencePowerW: 0 },
      { measuredPowerW: -10, referencePowerW: 1 },
    ])
      expect(runDecibelPowerRatio(bad).ok).toBe(false);
  });
});
