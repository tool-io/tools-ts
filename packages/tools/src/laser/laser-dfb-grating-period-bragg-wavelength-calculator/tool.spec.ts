import { describe, expect, it } from "vitest";
import {
  dfbGratingPeriodExample as example,
  runDfbGratingPeriod,
} from "./tool.js";
describe("DFB grating period", () => {
  it("applies the Bragg condition", () =>
    expect(runDfbGratingPeriod(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects nonphysical index and noninteger order", () => {
    expect(
      runDfbGratingPeriod({ braggWavelengthNm: 1550, neff: 1, order: 1 }).ok,
    ).toBe(false);
    expect(
      runDfbGratingPeriod({ braggWavelengthNm: 1550, neff: 3.3, order: 1.5 })
        .ok,
    ).toBe(false);
  });
});
