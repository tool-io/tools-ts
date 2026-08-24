import { describe, expect, it } from "vitest";
import {
  driverSeriesResistorExample as example,
  runDriverSeriesResistor,
} from "./tool.js";
describe("laser diode series resistor", () => {
  it("calculates peak and duty-averaged values", () =>
    expect(runDriverSeriesResistor(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects missing voltage headroom", () =>
    expect(
      runDriverSeriesResistor({
        dutyCyclePercent: 10,
        forwardVoltageV: 5,
        supplyVoltageV: 5,
        targetCurrentMa: 50,
      }).ok,
    ).toBe(false));
});
