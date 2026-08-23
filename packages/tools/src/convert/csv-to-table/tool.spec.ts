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
});
