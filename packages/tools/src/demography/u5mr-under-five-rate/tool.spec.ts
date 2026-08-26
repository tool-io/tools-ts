import { describe, expect, it } from "vitest";
import {
  calculateU5mrUnderFiveRate,
  runU5mrUnderFiveRate,
  u5mrUnderFiveRateExample,
} from "./tool.js";

describe("demography/u5mr-under-five-rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runU5mrUnderFiveRate(u5mrUnderFiveRateExample.input)).toEqual({
      ok: true,
      output: u5mrUnderFiveRateExample.output,
    });
  });

  it("matches the direct ratio on clean counts", () => {
    expect(
      calculateU5mrUnderFiveRate({ deathsUnderFive: 65, liveBirths: 1000 }),
    ).toEqual({
      underFiveMortalityRate: 65,
    });
  });

  it("rejects non-positive births or negative deaths", () => {
    expect(
      runU5mrUnderFiveRate({ deathsUnderFive: 10, liveBirths: 0 }).ok,
    ).toBe(false);
    expect(
      runU5mrUnderFiveRate({ deathsUnderFive: -1, liveBirths: 1000 }).ok,
    ).toBe(false);
  });
});
