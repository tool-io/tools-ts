import { describe, expect, it } from "vitest";
import {
  calculateMobilityTransitionTable,
  mobilityTransitionProbabilityTableExample,
  mobilityTransitionProbabilityTableTool,
  runMobilityTransitionProbabilityTable,
} from "./tool.js";

describe("mobilityTransitionProbabilityTableTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runMobilityTransitionProbabilityTable(
        mobilityTransitionProbabilityTableExample.input,
      ),
    ).toEqual({
      ok: true,
      output: mobilityTransitionProbabilityTableExample.output,
    });
  });

  it("normalizes each origin row independently and rejects negative counts", () => {
    expect(
      calculateMobilityTransitionTable({
        countsMatrix: [
          [1, 3],
          [2, 2],
        ],
      }),
    ).toEqual({
      transitionMatrix: [
        [0.25, 0.75],
        [0.5, 0.5],
      ],
    });
    const result = runMobilityTransitionProbabilityTable({
      countsMatrix: [[1, -1]],
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("countsMatrix");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(mobilityTransitionProbabilityTableExample)),
    ).toEqual(mobilityTransitionProbabilityTableExample);
    expect(mobilityTransitionProbabilityTableTool.contractVersion).toBe(1);
    expect(mobilityTransitionProbabilityTableTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMobilityTransitionProbabilityTable(null).ok).toBe(false);
    expect(
      runMobilityTransitionProbabilityTable({
        ...mobilityTransitionProbabilityTableExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
