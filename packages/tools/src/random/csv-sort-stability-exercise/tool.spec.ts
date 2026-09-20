import { describe, expect, it } from "vitest";
import tool, { example, calculateCsvSortStabilityExercise } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV stable sorting", () => {
  lightweightModelTests(tool, calculateCsvSortStabilityExercise, example);
  it("lightweight preserves relative order inside guaranteed ties", () => {
    const result = tool.execute(
      { keys: ["Z", "a"], rowCount: 4 },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected sort exercise");
    for (const key of ["Z", "a"]) {
      const original = result.output.rows
        .filter((row) => row.key === key)
        .map((row) => row.ordinal);
      expect(
        result.output.stableOrdinals.filter(
          (index) => result.output.rows[index]?.key === key,
        ),
      ).toEqual(original);
    }
    expect(result.output.stableOrdinals).not.toEqual(
      result.output.unstableOrdinals,
    );
  });
  it("lightweight rejects an unachievable tie guarantee", () => {
    expect(tool.execute({ ...example.input, rowCount: 2 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "rowCount", code: "insufficient_ties" }] },
    });
  });
});
