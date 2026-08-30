import { describe, expect, it } from "vitest";
import {
  evidenceHierarchyExample,
  rankEvidenceAgainstHierarchy,
  runEvidenceHierarchy,
} from "./tool.js";

describe("evidence hierarchy ranking table", () => {
  it("reproduces its canonical example", () => {
    expect(runEvidenceHierarchy(evidenceHierarchyExample.input)).toEqual({
      ok: true,
      output: evidenceHierarchyExample.output,
    });
  });

  it("ranks the first evidence type", () => {
    expect(
      rankEvidenceAgainstHierarchy({
        hierarchy: ["External", "Internal"],
        selectedEvidenceType: "external",
      }),
    ).toEqual({ selectedRank: 1, strongerCount: 0, strongerEvidence: [] });
  });

  it("preserves labels of evidence ranked above the selection", () => {
    expect(
      rankEvidenceAgainstHierarchy({
        hierarchy: ["A", "B", "C"],
        selectedEvidenceType: "C",
      }).strongerEvidence,
    ).toEqual(["A", "B"]);
  });

  it("rejects evidence missing from the hierarchy", () => {
    expect(
      runEvidenceHierarchy({ hierarchy: ["A"], selectedEvidenceType: "B" }),
    ).toMatchObject({
      error: { issues: [{ code: "evidence_type_not_ranked" }] },
      ok: false,
    });
  });
});
