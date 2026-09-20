import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateSpreadsheetCoordinateNavigationQuiz,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Spreadsheet coordinate quiz", () => {
  lightweightModelTests(
    tool,
    calculateSpreadsheetCoordinateNavigationQuiz,
    example,
  );
  it("lightweight expands through the Z to AA boundary in row-major order", () => {
    const draws = [0, 0.999];
    const result = tool.execute(
      {
        rowCount: 1,
        columnCount: 27,
        height: 1,
        width: 2,
        count: 1,
        absolute: false,
      },
      { random: () => draws.shift() ?? 0 },
    );
    if (!result.ok) throw new Error("Expected coordinate quiz");
    expect(result.output.prompts[0]).toMatchObject({
      address: "Z1",
      coordinate: { row: 1, column: 26 },
      range: "Z1:AA1",
      cellCount: 2,
      addresses: ["Z1", "AA1"],
    });
  });
  it("lightweight rejects a rectangle outside the declared grid", () => {
    expect(tool.execute({ ...example.input, rowCount: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "height", code: "infeasible_rectangle" }] },
    });
  });
});
