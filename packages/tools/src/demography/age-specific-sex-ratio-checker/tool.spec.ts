import { describe, expect, it } from "vitest";
import {
  ageSpecificSexRatioCheckerExample,
  runAgeSpecificSexRatioChecker,
} from "./tool.js";

describe("age-specific-sex-ratio-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAgeSpecificSexRatioChecker(ageSpecificSexRatioCheckerExample.input),
    ).toEqual({
      ok: true,
      output: ageSpecificSexRatioCheckerExample.output,
    });
  });

  it("flags ratios outside the default band", () => {
    const r = runAgeSpecificSexRatioChecker({
      maleByAge: [200, 100],
      femaleByAge: [100, 100],
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.sexRatios).toEqual([200, 100]);
    expect(r.output.outOfRangeCount).toBe(1);
  });

  it("rejects misaligned lists", () => {
    expect(
      runAgeSpecificSexRatioChecker({ maleByAge: [1, 2], femaleByAge: [1] }).ok,
    ).toBe(false);
    expect(
      runAgeSpecificSexRatioChecker({
        maleByAge: [1],
        femaleByAge: [1],
        minimumPlausible: -1,
        maximumPlausible: 110,
      }).ok,
    ).toBe(false);
  });
});
