import { describe, expect, it } from "vitest";
import {
  runThresholdTemperature,
  thresholdTemperatureExample as example,
} from "./tool.js";
describe("diode threshold T0 characteristic", () => {
  it("applies the exponential temperature relation", () =>
    expect(runThresholdTemperature(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("requires positive reference current and T0", () =>
    expect(
      runThresholdTemperature({ iRefMa: 20, t0K: 0, tOpC: 65, tRefC: 25 }).ok,
    ).toBe(false));
});
