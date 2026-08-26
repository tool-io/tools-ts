import { describe, expect, it } from "vitest";
import {
  runYldYearsLivedWithDisability,
  yldYearsLivedWithDisabilityExample,
} from "./tool.js";

describe("yld-years-lived-with-disability", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runYldYearsLivedWithDisability(yldYearsLivedWithDisabilityExample.input),
    ).toEqual({
      ok: true,
      output: yldYearsLivedWithDisabilityExample.output,
    });
  });

  it("multiplies by duration under the incidence approach", () => {
    const r = runYldYearsLivedWithDisability({
      approach: "incidence",
      cases: [100],
      disabilityWeights: [0.4],
      durationsYears: [2.5],
    });
    expect(r.ok && r.output.yldTotal).toBe(100);
  });

  it("rejects missing durations for incidence", () => {
    expect(
      runYldYearsLivedWithDisability({
        approach: "incidence",
        cases: [100, 50],
        disabilityWeights: [0.4, 0.1],
      }).ok,
    ).toBe(false);
  });
});
