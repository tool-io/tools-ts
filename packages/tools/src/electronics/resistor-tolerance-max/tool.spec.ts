import { describe, expect, it } from "vitest";
import {
  resistorToleranceMaxExample,
  runResistorToleranceMax,
} from "./tool.js";
describe("Max Resistance", () => {
  it("publishes an executable example", () =>
    expect(runResistorToleranceMax(resistorToleranceMaxExample.input)).toEqual({
      ok: true,
      output: resistorToleranceMaxExample.output,
    }));
  it("reaches the upper bound at twenty percent", () =>
    expect(
      runResistorToleranceMax({ nominalOhms: 100, tolerancePercent: 20 }),
    ).toEqual({ ok: true, output: { maximumResistanceOhms: 120 } }));
  it("rejects negative nominal resistance", () =>
    expect(
      runResistorToleranceMax({ nominalOhms: -10, tolerancePercent: 5 }).ok,
    ).toBe(false));
  it("rejects out-of-range tolerance", () =>
    expect(
      runResistorToleranceMax({ nominalOhms: 100, tolerancePercent: -1 }).ok,
    ).toBe(false));
});
