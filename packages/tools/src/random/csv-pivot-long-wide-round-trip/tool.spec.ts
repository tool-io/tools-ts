import { describe, expect, it } from "vitest";
import tool, { example, calculateCsvPivotLongWideRoundTrip } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV long wide reshape", () => {
  lightweightModelTests(tool, calculateCsvPivotLongWideRoundTrip, example);
  it("lightweight independently sums repeated keys and conserves the grand total", () => {
    const result = tool.execute(
      {
        entities: ["A", "B"],
        measures: ["x"],
        duplicateCount: 2,
        aggregation: "sum",
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected reshape");
    expect(result.output.wideRows).toEqual([
      { entity: "A", values: [3] },
      { entity: "B", values: [1] },
    ]);
    expect(result.output.aggregatedLongRows).toEqual([
      { entity: "A", measure: "x", value: 3 },
      { entity: "B", measure: "x", value: 1 },
    ]);
    expect(
      result.output.longRows.reduce((sum, row) => sum + row.value, 0),
    ).toBe(4);
  });
  it("lightweight rejects duplicate group identities", () => {
    expect(
      tool.execute({ ...example.input, measures: ["x", "x"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "measures", code: "duplicate_entries" }] },
    });
  });
});
