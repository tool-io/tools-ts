import { describe, expect, it } from "vitest";
import { calculateMannWhitneyU, mannWhitneyUExample } from "./tool.js";

describe("Mann-Whitney U", () => {
  it("calculates both U statistics", () => {
    expect(calculateMannWhitneyU({ first: [1, 2], second: [3, 4] })).toEqual({
      ok: true,
      output: { firstU: 0, secondU: 4, statistic: 0 },
    });
  });

  it("rejects an empty sample", () => {
    expect(calculateMannWhitneyU({ first: [], second: [1] })).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });

  it("publishes an executable example", () => {
    expect(calculateMannWhitneyU(mannWhitneyUExample.input).ok).toBe(true);
  });
});
