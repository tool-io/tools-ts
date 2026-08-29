import { describe, expect, it } from "vitest";
import {
  calculateMarkdownToTable,
  markdownToTableExample,
  runMarkdownToTable,
} from "./tool.js";

describe("convert/markdown-to-table", () => {
  it("creates the canonical example table", () => {
    expect(runMarkdownToTable(markdownToTableExample.input)).toEqual({
      ok: true,
      output: markdownToTableExample.output,
    });
  });

  it("handles escaped pipes and duplicate normalized headers", () => {
    const { table } = calculateMarkdownToTable({
      markdown: "A B|A-B\n---|---\nx\\|y|2",
    });
    expect(table.schema.fields.map((field) => field.id)).toEqual([
      "a-b",
      "a-b-2",
    ]);
    expect(table.rows).toEqual([["x|y", 2]]);
  });

  it("rejects malformed rows and impossible dates remain strings", () => {
    expect(runMarkdownToTable({ markdown: "A|B\n---|---\n1" })).toMatchObject({
      error: {
        issues: [{ code: "inconsistent_row_count", field: "markdown" }],
      },
      ok: false,
    });
    expect(
      calculateMarkdownToTable({ markdown: "Date\n---\n2025-02-30" }).table
        .schema.fields[0]?.dataType,
    ).toEqual({ kind: "string" });
  });
});
