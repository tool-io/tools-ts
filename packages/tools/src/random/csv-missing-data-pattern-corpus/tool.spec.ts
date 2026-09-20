import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvMissingDataPatternCorpus,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV missingness patterns", () => {
  lightweightModelTests(tool, calculateCsvMissingDataPatternCorpus, example);
  it("lightweight marks a complete column while preserving original blank cells elsewhere", () => {
    const result = tool.execute(
      {
        rows: [
          ["a", ""],
          ["b", "c"],
        ],
        pattern: { kind: "column", count: 1 },
        defaultValue: "NA",
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected mask");
    expect(result.output.missingMask).toEqual([
      [true, false],
      [true, false],
    ]);
    expect(result.output.defaultFilledCsv).toBe("NA,\nNA,c");
  });
  it("lightweight rejects oversized patterns and closed discriminant branches", () => {
    expect(
      tool.execute({ ...example.input, pattern: { kind: "cell", count: 5 } }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "pattern", code: "infeasible_pattern" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        pattern: { kind: "cell", count: 1, width: 1 },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "pattern", code: "invalid_field" }] },
    });
  });
});
