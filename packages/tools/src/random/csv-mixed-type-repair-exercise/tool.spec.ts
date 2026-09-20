import { describe, expect, it } from "vitest";
import tool, { example, calculateCsvMixedTypeRepairExercise } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV mixed type repair", () => {
  lightweightModelTests(tool, calculateCsvMixedTypeRepairExercise, example);
  it("lightweight retains typed Boolean answers independently of lexical CSV classes", () => {
    const result = tool.execute(
      { columnType: "boolean", values: ["YES", "0"] },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected Boolean exercise");
    expect(result.output.originalBooleans).toEqual([true, false]);
    expect(result.output.damagedValues).toEqual(["?", "0"]);
    expect(result.output.answerValues).toEqual(["YES", "0"]);
  });
  it("lightweight rejects incompatible supplied types and trailing tokens", () => {
    expect(tool.execute({ ...example.input, values: ["2\n"] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "values.0", code: "invalid_integer" }] },
    });
    expect(
      tool.execute({ columnType: "boolean", values: ["maybe"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "values.0", code: "unknown_boolean" }] },
    });
  });
});
