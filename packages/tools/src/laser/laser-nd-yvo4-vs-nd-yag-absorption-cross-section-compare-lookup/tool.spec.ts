import { describe, expect, it } from "vitest";
import {
  ndYvo4NdYagAbsorptionCompareExample as example,
  runNdYvo4NdYagAbsorptionCompare,
} from "./tool.js";
describe("Nd host absorption comparison", () => {
  it("compares absorption coefficients at equal doping", () =>
    expect(runNdYvo4NdYagAbsorptionCompare(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("requires positive doping", () =>
    expect(
      runNdYvo4NdYagAbsorptionCompare({
        yagDopingAtPercent: 0,
        yvo4DopingAtPercent: 1,
      }).ok,
    ).toBe(false));
});
