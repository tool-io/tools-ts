import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvBooleanTokenCleaningExercise,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV Boolean cleaning", () => {
  lightweightModelTests(
    tool,
    calculateCsvBooleanTokenCleaningExercise,
    example,
  );
  it("lightweight normalizes known casing and keeps blanks distinct from false", () => {
    const result = tool.execute(
      { tokens: [" YeS ", "  "], count: 2 },
      {
        random: (() => {
          const draws = [0, 0.99];
          return () => draws.shift() ?? 0;
        })(),
      },
    );
    if (!result.ok) throw new Error("Expected tokens");
    expect(result.output.cells).toEqual([
      { token: " YeS ", classification: "boolean", normalized: true },
      { token: "  ", classification: "empty", normalized: null },
    ]);
  });
  it("lightweight rejects empty token banks and oversized output", () => {
    expect(tool.execute({ ...example.input, tokens: [] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "tokens", code: "invalid_field" }] },
    });
    expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
});
