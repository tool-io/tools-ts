import { describe, expect, it } from "vitest";
import { calculatePureNashEquilibria, runPureNashEquilibria } from "./tool.js";

describe("pureNashEquilibriaTool", () => {
  it("finds both coordination-game equilibria", () => {
    const result = calculatePureNashEquilibria(
      [
        [2, 0],
        [0, 1],
      ],
      [
        [2, 0],
        [0, 1],
      ],
    );
    expect(
      result.equilibria.map(({ rowStrategy, columnStrategy }) => [
        rowStrategy,
        columnStrategy,
      ]),
    ).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it("rejects differently sized payoff matrices", () => {
    expect(
      runPureNashEquilibria({ rowPayoffs: [[1, 2]], columnPayoffs: [[1]] }).ok,
    ).toBe(false);
  });
});
