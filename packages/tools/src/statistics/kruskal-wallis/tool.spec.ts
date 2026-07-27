import { describe, expect, it } from "vitest";
import { calculateKruskalWallis, kruskalWallisExample } from "./tool.js";

describe("Kruskal-Wallis", () => {
  it("calculates the H statistic", () => {
    expect(
      calculateKruskalWallis({
        groups: [
          [1, 2],
          [3, 4],
        ],
      }),
    ).toEqual({
      ok: true,
      output: { degreesOfFreedom: 1, groupRankSums: [3, 7], statistic: 2.4 },
    });
  });

  it("rejects a single group", () => {
    expect(calculateKruskalWallis({ groups: [[1, 2]] })).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });

  it("publishes an executable example", () => {
    expect(calculateKruskalWallis(kruskalWallisExample.input).ok).toBe(true);
  });
});
