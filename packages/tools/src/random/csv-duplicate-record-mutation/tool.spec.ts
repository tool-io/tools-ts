import { describe, expect, it } from "vitest";
import tool, { example, calculateCsvDuplicateRecordMutation } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV duplicate mutation", () => {
  lightweightModelTests(tool, calculateCsvDuplicateRecordMutation, example);
  it("lightweight includes original duplicate members in exact group truth", () => {
    const result = tool.execute(
      {
        rows: [["x"], ["x"]],
        exactCopies: 1,
        nearCopies: 0,
        nearColumn: 0,
        replacement: "z",
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected duplication");
    expect(result.output.duplicateGroups).toEqual([[0, 1, 2]]);
    expect(result.output.duplicateRowCount).toBe(3);
    expect(result.output.provenance[2]).toEqual({
      sourceRow: 0,
      kind: "exact",
    });
  });
  it("lightweight rejects no-op near mutations and invalid columns", () => {
    expect(tool.execute({ ...example.input, replacement: "2" })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "replacement", code: "unchanged_mutation" }] },
    });
    expect(tool.execute({ ...example.input, nearColumn: 2 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "nearColumn", code: "column_range" }] },
    });
  });
});
