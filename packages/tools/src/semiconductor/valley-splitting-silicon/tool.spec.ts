import { describe, expect, it } from "vitest";
import {
  runSiliconValleySplitting,
  siliconValleySplittingExample,
} from "./tool.js";

describe("silicon interface valley splitting", () => {
  it("reproduces the documented calibrated example", () =>
    expect(
      runSiliconValleySplitting(siliconValleySplittingExample.input),
    ).toEqual({ ok: true, output: siliconValleySplittingExample.output }));
  it("returns the intercept at zero electric field", () =>
    expect(
      runSiliconValleySplitting({
        fieldSlopeMicroEvPerMVPerM: 3,
        interfaceElectricFieldMVPerM: 0,
        zeroFieldSplittingMicroEv: 20,
      }),
    ).toEqual({ ok: true, output: { splittingMicroEv: 20 } }));
  it("rejects a negative field magnitude", () =>
    expect(
      runSiliconValleySplitting({
        fieldSlopeMicroEvPerMVPerM: 3,
        interfaceElectricFieldMVPerM: -1,
        zeroFieldSplittingMicroEv: 20,
      }),
    ).toMatchObject({ ok: false }));
});
