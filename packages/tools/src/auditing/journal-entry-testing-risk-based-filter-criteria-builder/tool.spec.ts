import { describe, expect, it } from "vitest";
import {
  buildJournalRiskFilter,
  journalRiskFilterExample,
  runJournalRiskFilter,
} from "./tool.js";

describe("journal entry risk-based filter builder", () => {
  it("reproduces its canonical example", () => {
    expect(runJournalRiskFilter(journalRiskFilterExample.input)).toEqual({
      ok: true,
      output: journalRiskFilterExample.output,
    });
  });

  it("selects entries exactly at the score threshold", () => {
    expect(
      buildJournalRiskFilter({
        entryAttributes: [[1, 0, 0, 0]],
        entryIds: ["A"],
        selectionThreshold: 1,
        weights: [1, 2, 3, 4],
      }).selectedIds,
    ).toEqual(["A"]);
  });

  it("supports zero weights", () => {
    expect(
      buildJournalRiskFilter({
        entryAttributes: [[1, 1, 1, 1]],
        entryIds: ["A"],
        selectionThreshold: 0,
        weights: [0, 0, 0, 0],
      }).scores,
    ).toEqual([0]);
  });

  it("rejects a weight count other than four", () => {
    expect(
      runJournalRiskFilter({
        entryAttributes: [[1, 0, 0, 0]],
        entryIds: ["A"],
        selectionThreshold: 1,
        weights: [1],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_filter_weights", field: "weights" }] },
      ok: false,
    });
  });
});
