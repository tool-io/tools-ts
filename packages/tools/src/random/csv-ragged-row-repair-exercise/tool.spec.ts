import { describe, expect, it } from "vitest";
import tool, { example, calculateCsvRaggedRowRepairExercise } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV ragged record repair", () => {
  lightweightModelTests(tool, calculateCsvRaggedRowRepairExercise, example);
  it("lightweight retains quoted pristine answers and audits appended fields", () => {
    const result = tool.execute(
      { rows: [["a,b", "c"]], mutationCount: 1, extraValue: "x\ny" },
      { random: () => 0.99 },
    );
    if (!result.ok) throw new Error("Expected mutation");
    expect(result.output.csv).toBe('"a,b",c,"x\ny"');
    expect(result.output.raggedIndices).toEqual([0]);
    expect(result.output.answerRows).toEqual([["a,b", "c"]]);
  });
  it("lightweight rejects excess mutation count", () => {
    expect(tool.execute({ ...example.input, mutationCount: 3 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "mutationCount", code: "infeasible_mutation_count" }],
      },
    });
  });
});
