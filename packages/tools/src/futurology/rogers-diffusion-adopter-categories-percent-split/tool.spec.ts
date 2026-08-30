import { describe, expect, it } from "vitest";
import {
  rogersSplitExample,
  runRogersSplit,
  splitRogersAdopterCategories,
} from "./tool.js";

describe("Rogers adopter category percentage split", () => {
  it("reproduces its canonical example", () => {
    expect(runRogersSplit(rogersSplitExample.input)).toEqual({
      ok: true,
      output: rogersSplitExample.output,
    });
  });

  it("supports a custom cumulative split", () => {
    expect(
      splitRogersAdopterCategories({
        cumulativeCategoryCutoffsPercent: [5, 20, 50, 80, 100],
      }).categorySharesPercent,
    ).toEqual([5, 15, 30, 30, 20]);
  });

  it("uses the default split when no cutoffs are provided", () => {
    const result = runRogersSplit({});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output).toEqual(rogersSplitExample.output);
  });

  it("rejects cutoffs that do not end at 100", () => {
    expect(
      runRogersSplit({ cumulativeCategoryCutoffsPercent: [2, 10, 30, 60, 99] }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "final_category_cutoff_required",
            field: "cumulativeCategoryCutoffsPercent",
          },
        ],
      },
      ok: false,
    });
  });
});
