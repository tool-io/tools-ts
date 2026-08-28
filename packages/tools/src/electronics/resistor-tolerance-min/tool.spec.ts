import { describe, expect, it } from "vitest";
import {
  resistorToleranceMinExample,
  runResistorToleranceMin,
} from "./tool.js";
describe("Min Resistance", () => {
  it("publishes an executable example", () =>
    expect(runResistorToleranceMin(resistorToleranceMinExample.input)).toEqual({
      ok: true,
      output: resistorToleranceMinExample.output,
    }));
  it("reaches the lower bound at twenty percent", () =>
    expect(
      runResistorToleranceMin({ nominalOhms: 100, tolerancePercent: 20 }),
    ).toEqual({ ok: true, output: { minimumResistanceOhms: 80 } }));
  it("rejects zero nominal resistance", () =>
    expect(
      runResistorToleranceMin({ nominalOhms: 0, tolerancePercent: 5 }).ok,
    ).toBe(false));
  it("rejects out-of-range tolerance", () =>
    expect(
      runResistorToleranceMin({ nominalOhms: 100, tolerancePercent: 25 }).ok,
    ).toBe(false));
});
