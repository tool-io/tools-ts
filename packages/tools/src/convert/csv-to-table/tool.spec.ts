import { describe, expect, it } from "vitest";
import {
  calculateCsvToTable,
  csvToTableExample,
  runCsvToTable,
} from "./tool.js";

describe("convert/csv-to-table", () => {
  it("creates the canonical example table", () => {
    expect(runCsvToTable(csvToTableExample.input)).toEqual({
      ok: true,
      output: csvToTableExample.output,
    });
  });

  it("preserves unsafe integers as strings", () => {
    expect(
      calculateCsvToTable({ csv: "id\n9007199254740993\n" }).table.rows[0],
    ).toEqual(["9007199254740993"]);
  });

  it("keeps impossible dates as strings and makes normalized ids unique", () => {
    const table = calculateCsvToTable({
      csv: "Due Date,Due-Date\n2025-02-30,2025-02-28\n",
    }).table;
    expect(table.schema.fields.map((field) => field.id)).toEqual([
      "due-date",
      "due-date-2",
    ]);
    expect(table.schema.fields[0]?.dataType).toEqual({ kind: "string" });
  });
});
