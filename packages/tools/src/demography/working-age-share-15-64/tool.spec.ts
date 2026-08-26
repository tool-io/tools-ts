import { describe, expect, it } from "vitest";
import { runWorkingAgeShare1564, workingAgeShare1564Example } from "./tool.js";

describe("working-age-share-15-64", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWorkingAgeShare1564(workingAgeShare1564Example.input)).toEqual({
      ok: true,
      output: workingAgeShare1564Example.output,
    });
  });

  it("handles a child-heavy population", () => {
    const r = runWorkingAgeShare1564({
      workingAgePopulation1564: 555,
      totalPopulation: 1000,
    });
    expect(r.ok && r.output.workingAgeSharePercent).toBe(55.5);
  });

  it("rejects an empty total population", () => {
    expect(
      runWorkingAgeShare1564({
        workingAgePopulation1564: 0,
        totalPopulation: 0,
      }).ok,
    ).toBe(false);
  });
});
