import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, calculateCsvHeaderRepairExercise } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV header repair", () => {
  lightweightModelTests(tool, calculateCsvHeaderRepairExercise, example);
  it("lightweight independently reserves suffixes and preserves every data column", () => {
    const result = tool.execute(
      { headers: ["id", "id_2"], rows: [["x", "y"]] },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected repair");
    expect(result.output.repairedHeaders).toEqual([
      "id",
      "id_2",
      "id_3",
      "column_4",
    ]);
    expect(result.output.rows).toEqual([["x", "y", "x", ""]]);
  });
  it("lightweight rejects normalization collisions and table width mismatch", () => {
    expect(
      tool.execute({ ...example.input, headers: ["Id", "id"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "headers", code: "duplicate_entries" }] },
    });
    expect(tool.execute({ ...example.input, rows: [["one"]] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "rows", code: "ragged_rows" }] },
    });
  });
  it("lightweight preserves expanded Unicode upper and lower case within honest output bounds", () => {
    for (const [header, damaged, repaired] of [
      ["ß".repeat(64), "SS".repeat(64), "ss".repeat(64)],
      ["İ".repeat(64), "İ".repeat(64), "i\u0307".repeat(64)],
    ]) {
      const result = tool.execute(
        { headers: [header], rows: [["x"]] },
        { random: () => 0 },
      );
      if (!result.ok) throw new Error("Expected Unicode header repair");
      expect(result.output.damagedHeaders).toEqual([damaged, damaged, ""]);
      expect(result.output.repairedHeaders).toEqual([
        repaired,
        repaired + "_2",
        "column_3",
      ]);
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
    }
  });
});
