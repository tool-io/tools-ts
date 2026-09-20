import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvAggregateReconciliationExercise,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV exact reconciliation", () => {
  lightweightModelTests(
    tool,
    calculateCsvAggregateReconciliationExercise,
    example,
  );
  it("lightweight retains exact negative and beyond-safe grand sums", () => {
    const result = tool.execute(
      {
        groupCount: 1,
        rowsPerGroup: 2,
        minimumValue: Number.MAX_SAFE_INTEGER,
        maximumValue: Number.MAX_SAFE_INTEGER,
        discrepancy: -1,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected exact totals");
    expect(result.output.correctGrandTotal).toBe("18014398509481982");
    expect(result.output.reportedGrandTotal).toBe("18014398509481981");
    expect(result.output.subtotals[0]?.discrepancy).toBe("-1");
  });
  it("lightweight supports zero discrepancy and rejects reversed ranges", () => {
    const control = tool.execute({ ...example.input, discrepancy: 0 });
    if (!control.ok) throw new Error("Expected control");
    expect(control.output.correctGrandTotal).toBe(
      control.output.reportedGrandTotal,
    );
    expect(tool.execute({ ...example.input, minimumValue: 10 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumValue", code: "invalid_integer_range" }],
      },
    });
  });
});
