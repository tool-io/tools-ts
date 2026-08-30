import { describe, expect, it } from "vitest";
import {
  calculateTypeSetCompletenessPercent,
  example,
  runTypeSetCompletenessPercent,
} from "./tool.js";

describe("numismatics/type-set-completeness-percent", () => {
  it("calculates the published example", () => {
    expect(calculateTypeSetCompletenessPercent(example.input)).toEqual(
      example.output,
    );
    expect(runTypeSetCompletenessPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runTypeSetCompletenessPercent({
      ...example.input,
      collectedTypes: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runTypeSetCompletenessPercent({ ...example.input, targetTypes: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "targetTypes" }] },
    });
  });
});
