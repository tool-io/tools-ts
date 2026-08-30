import { describe, expect, it } from "vitest";
import {
  managementOverrideFocusExample,
  runManagementOverrideFocus,
  selectManagementOverrideJournalEntries,
} from "./tool.js";

describe("management override journal entry testing focus", () => {
  it("reproduces its canonical example", () => {
    expect(
      runManagementOverrideFocus(managementOverrideFocusExample.input),
    ).toEqual({
      ok: true,
      output: managementOverrideFocusExample.output,
    });
  });

  it("excludes entries already approved", () => {
    expect(
      selectManagementOverrideJournalEntries({
        attributes: [[1, 1, 1, 1, 1]],
        entryIds: ["JE-9"],
        selectionThreshold: 2,
      }).selectedIds,
    ).toEqual([]);
  });

  it("selects multiple entries at the exact threshold", () => {
    expect(
      selectManagementOverrideJournalEntries({
        attributes: [
          [1, 1, 0, 0, 0],
          [0, 0, 1, 1, 0],
        ],
        entryIds: ["A", "B"],
        selectionThreshold: 2,
      }).selectedCount,
    ).toBe(2);
  });

  it("rejects mismatched IDs and attribute rows", () => {
    expect(
      runManagementOverrideFocus({
        attributes: [[1, 0, 0, 0, 0]],
        entryIds: [],
        selectionThreshold: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "entry_data_length_mismatch", field: "attributes" }],
      },
      ok: false,
    });
  });
});
