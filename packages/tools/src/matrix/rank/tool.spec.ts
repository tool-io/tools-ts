import { describe, expect, it } from "vitest";
import { rankExample, calculateRank, runRank } from "./tool.js";

describe("matrix/rank", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRank(rankExample.input)).toEqual({
      ok: true,
      output: rankExample.output,
    });
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runRank({ matrix: [] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_matrix)", () => {
    expect(runRank({ matrix: [[1, 2], [3]] }).ok).toBe(false);
  });
  it("counts independent rows of tall matrices", () => {
    const result = runRank({
      matrix: [
        [1, 2],
        [2, 4],
        [3, 6],
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.rank).toBe(1);
  });

  it("gives full rank for the identity", () => {
    const identity = runRank({
      matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
    });
    expect(identity.ok).toBe(true);
    if (!identity.ok) return;
    expect(identity.output.rank).toBe(3);
  });
});
