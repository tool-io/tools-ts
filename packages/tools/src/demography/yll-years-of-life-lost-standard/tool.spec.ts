import { describe, expect, it } from "vitest";
import {
  runYllYearsOfLifeLostStandard,
  yllYearsOfLifeLostStandardExample,
} from "./tool.js";

describe("yll-years-of-life-lost-standard", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runYllYearsOfLifeLostStandard(yllYearsOfLifeLostStandardExample.input),
    ).toEqual({
      ok: true,
      output: yllYearsOfLifeLostStandardExample.output,
    });
  });

  it("returns zero when there are no deaths", () => {
    const r = runYllYearsOfLifeLostStandard({
      numberOfDeaths: [0, 0],
      standardLifeExpectancyAtDeath: [80, 40],
    });
    expect(r.ok && r.output.yllTotal).toBe(0);
  });

  it("rejects misaligned lists", () => {
    expect(
      runYllYearsOfLifeLostStandard({
        numberOfDeaths: [1, 2],
        standardLifeExpectancyAtDeath: [80],
      }).ok,
    ).toBe(false);
  });
});
