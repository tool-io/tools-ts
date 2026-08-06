import { describe, expect, it } from "vitest";
import {
  robustMinimaxExample,
  runRobustMinimax,
  solveRobustMinimax,
} from "./tool.js";

describe("Robust Minimax", () => {
  it("minimizes the worst scenario loss", () =>
    expect(
      solveRobustMinimax(robustMinimaxExample.input.scenarios, 0, 5, 0.01),
    ).toEqual(robustMinimaxExample.output.solution));
  it("rejects empty scenarios", () =>
    expect(
      runRobustMinimax({
        ...robustMinimaxExample.input,
        scenarios: { scenarios: [] },
      }).ok,
    ).toBe(false));
  it("publishes an executable example", () =>
    expect(runRobustMinimax(robustMinimaxExample.input)).toEqual({
      ok: true,
      output: robustMinimaxExample.output,
    }));
});
