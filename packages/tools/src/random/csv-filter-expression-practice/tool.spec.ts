import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvFilterExpressionPractice,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV filter predicates", () => {
  lightweightModelTests(tool, calculateCsvFilterExpressionPractice, example);
  it("lightweight handles exact threshold equality and literal category text", () => {
    const result = tool.execute(
      {
        categories: ["x,y"],
        rowCount: 1,
        minimumValue: 3,
        maximumValue: 3,
        predicates: [
          { kind: "greater", value: "3.000" },
          { kind: "equals", value: "x,y" },
        ],
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected predicates");
    expect(result.output.exercises.map((row) => row.passes)).toEqual([
      [false],
      [true],
    ]);
    expect(result.output.exercises[1]?.selectedCsv).toBe(
      'category,amount\n"x,y",3',
    );
  });
  it("lightweight rejects arbitrary expressions and malformed thresholds", () => {
    expect(
      tool.execute({
        ...example.input,
        predicates: [{ kind: "eval", value: "true" }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "predicates", code: "invalid_field" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        predicates: [{ kind: "greater", value: "1+2" }],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "predicates.0.value", code: "invalid_decimal" }],
      },
    });
  });
});
