import { describe, expect, it } from "vitest";
import { runHeatOfSolution } from "./tool.js";

describe("Heat of Solution Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runHeatOfSolution({
        hydrationEnthalpyKJPerMol: -776,
        latticeDissociationEnthalpyKJPerMol: 780,
      }),
    ).toEqual({ ok: true, output: { heatOfSolutionKJPerMol: 4 } });
  });
  it("rejects invalid input", () =>
    expect(runHeatOfSolution(null).ok).toBe(false));
});
