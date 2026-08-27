import { describe, expect, it } from "vitest";
import {
  depletedMantleModelAgeExample,
  runDepletedMantleModelAge,
} from "./tool.js";

describe("depleted-mantle-model-age", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDepletedMantleModelAge(depletedMantleModelAgeExample.input),
    ).toEqual({
      ok: true,
      output: depletedMantleModelAgeExample.output,
    });
  });

  it("rejects a sample with mantle-identical Sm/Nd", () => {
    expect(
      runDepletedMantleModelAge({
        nd143nd144Sample: 0.512638,
        sm147nd144Sample: 0.2137,
      }).ok,
    ).toBe(false);
  });

  it("rejects a sample more radiogenic than the mantle", () => {
    expect(
      runDepletedMantleModelAge({
        nd143nd144Sample: 0.514,
        sm147nd144Sample: 0.1,
      }).ok,
    ).toBe(false);
  });
});
