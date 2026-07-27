import { describe, expect, it } from "vitest";
import {
  calculateWilcoxonSignedRank,
  wilcoxonSignedRankExample,
} from "./tool.js";

describe("Wilcoxon signed-rank", () => {
  it("uses average ranks for ties", () => {
    expect(
      calculateWilcoxonSignedRank({ first: [1, 2, 3], second: [0, 4, 1] }),
    ).toEqual({
      ok: true,
      output: {
        negativeRankSum: 2.5,
        nonzeroPairs: 3,
        positiveRankSum: 3.5,
        statistic: 2.5,
      },
    });
  });

  it("rejects samples with no nonzero differences", () => {
    expect(
      calculateWilcoxonSignedRank({ first: [1, 2], second: [1, 2] }),
    ).toMatchObject({ error: { code: "invalid_input" }, ok: false });
  });

  it("publishes an executable example", () => {
    expect(
      calculateWilcoxonSignedRank(wilcoxonSignedRankExample.input).ok,
    ).toBe(true);
  });
});
