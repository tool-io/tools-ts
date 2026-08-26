import { describe, expect, it } from "vitest";
import {
  calculateChildrenEverBornCebAverage,
  runChildrenEverBornCebAverage,
  childrenEverBornCebAverageExample,
} from "./tool.js";

describe("demography/children-ever-born-ceb-average", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runChildrenEverBornCebAverage(childrenEverBornCebAverageExample.input),
    ).toEqual({
      ok: true,
      output: childrenEverBornCebAverageExample.output,
    });
  });

  it("falls back to the aggregate ratio when no parity list is given", () => {
    expect(
      calculateChildrenEverBornCebAverage({
        totalChildrenBorn: 420,
        totalWomen: 500,
      }),
    ).toEqual({ averageChildrenEverBorn: 0.84 });
  });

  it("rejects empty inputs and non-positive women", () => {
    expect(runChildrenEverBornCebAverage({}).ok).toBe(false);
    expect(runChildrenEverBornCebAverage({ womenByParity: [0, 0] }).ok).toBe(
      false,
    );
    expect(
      runChildrenEverBornCebAverage({ totalChildrenBorn: -1, totalWomen: 100 })
        .ok,
    ).toBe(false);
  });
});
