import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvLocaleNumberCleaningExercise,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV EU numeric cleaning", () => {
  lightweightModelTests(
    tool,
    calculateCsvLocaleNumberCleaningExercise,
    example,
  );
  it("lightweight independently preserves decimal precision above safe Number integers", () => {
    const result = tool.execute({
      ...example.input,
      values: ["9.007.199.254.740.993,010"],
      count: 1,
    });
    if (!result.ok) throw new Error("Expected exact decimal");
    expect(result.output.normalized).toEqual(["9007199254740993.01"]);
  });
  it("lightweight rejects malformed grouping at the supplied cell", () => {
    expect(
      tool.execute({ ...example.input, values: ["12.34,50"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "values.0", code: "invalid_decimal" }] },
    });
  });
});
