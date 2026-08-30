import { describe, expect, it } from "vitest";
import {
  classifyEvidenceQuadrants,
  evidenceQuadrantExample,
  runEvidenceQuadrant,
} from "./tool.js";

describe("evidence relevance reliability two-axis lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runEvidenceQuadrant(evidenceQuadrantExample.input)).toEqual({
      ok: true,
      output: evidenceQuadrantExample.output,
    });
  });

  it("classifies combined ratings at quadrant boundaries", () => {
    expect(
      classifyEvidenceQuadrants({
        assessments: [
          [4, 4],
          [2, 3],
          [1, 3],
        ],
      }),
    ).toMatchObject({
      highEvidenceCount: 1,
      mixedEvidenceCount: 1,
      lowEvidenceCount: 1,
    });
  });

  it("tracks multiple low-evidence indices", () => {
    expect(
      classifyEvidenceQuadrants({
        assessments: [
          [1, 1],
          [2, 2],
        ],
      }).lowEvidenceIndices,
    ).toEqual([0, 1]);
  });

  it("rejects a rating outside one through five", () => {
    expect(runEvidenceQuadrant({ assessments: [[6, 3]] })).toMatchObject({
      error: {
        issues: [{ code: "invalid_evidence_rating", field: "assessments.0.0" }],
      },
      ok: false,
    });
  });
});
