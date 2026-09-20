import { describe, expect, it } from "vitest";
import tool, { example, calculateCsvDelimiterDetectionQuiz } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV delimiter quiz", () => {
  lightweightModelTests(tool, calculateCsvDelimiterDetectionQuiz, example);
  it("lightweight reports real ambiguity and guarantees the quoted control", () => {
    const result = tool.execute(
      {
        rows: [
          ["a;b", "c"],
          ["d;e", "f"],
        ],
        delimiters: [","],
        quoteAll: false,
        includeAmbiguous: true,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected quiz");
    expect(result.output.cases[0]?.detection.ambiguous).toBe(true);
    expect(result.output.cases[1]?.detection.candidates).toEqual([]);
  });
  it("lightweight rejects repeated dialect choices", () => {
    expect(
      tool.execute({ ...example.input, delimiters: [",", ","] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "delimiters", code: "duplicate_entries" }] },
    });
  });
});
