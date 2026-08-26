import { describe, expect, it } from "vitest";
import {
  ageingIndexOldYoungRatioExample,
  runAgeingIndexOldYoungRatio,
} from "./tool.js";

describe("ageing-index-old-young-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAgeingIndexOldYoungRatio(ageingIndexOldYoungRatioExample.input),
    ).toEqual({
      ok: true,
      output: ageingIndexOldYoungRatioExample.output,
    });
  });

  it("returns zero when no one is 65 or older", () => {
    const r = runAgeingIndexOldYoungRatio({
      populationUnder15: 500,
      population65AndOver: 0,
    });
    expect(r.ok && r.output.ageingIndexPercent).toBe(0);
  });

  it("rejects a zero young population", () => {
    expect(
      runAgeingIndexOldYoungRatio({
        populationUnder15: 0,
        population65AndOver: 10,
      }).ok,
    ).toBe(false);
  });
});
