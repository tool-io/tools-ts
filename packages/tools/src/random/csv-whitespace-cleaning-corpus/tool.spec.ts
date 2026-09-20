import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvWhitespaceCleaningCorpus,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV whitespace corpus", () => {
  lightweightModelTests(tool, calculateCsvWhitespaceCleaningCorpus, example);
  it("lightweight preserves invisible ZWSP under the declared trim policy", () => {
    const result = tool.execute(
      { rows: [["a  b"]], mutationCount: 1 },
      { random: () => 0.99 },
    );
    if (!result.ok) throw new Error("Expected mutation");
    expect(result.output.cleanedRows).toEqual([["\u200ba  b\u200b"]]);
    expect(result.output.mutations[0]?.trimRestores).toBe(false);
  });
  it("lightweight rejects excess distinct cell mutations", () => {
    expect(tool.execute({ ...example.input, mutationCount: 5 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "mutationCount", code: "infeasible_mutation_count" }],
      },
    });
  });
});
