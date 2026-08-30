import { describe, expect, it } from "vitest";
import {
  calculateWeightDeviationFromStandard,
  example,
  runWeightDeviationFromStandard,
} from "./tool.js";

describe("numismatics/weight-deviation-from-standard", () => {
  it("calculates the published example", () => {
    expect(calculateWeightDeviationFromStandard(example.input)).toEqual(
      example.output,
    );
    expect(runWeightDeviationFromStandard(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runWeightDeviationFromStandard({
      ...example.input,
      measuredWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runWeightDeviationFromStandard({
        ...example.input,
        standardWeightGrams: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "standardWeightGrams" }] },
    });
  });
});
