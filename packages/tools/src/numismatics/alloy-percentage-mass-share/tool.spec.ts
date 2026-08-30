import { describe, expect, it } from "vitest";
import {
  calculateAlloyPercentageMassShare,
  example,
  runAlloyPercentageMassShare,
} from "./tool.js";

describe("numismatics/alloy-percentage-mass-share", () => {
  it("calculates the published example", () => {
    expect(calculateAlloyPercentageMassShare(example.input)).toEqual(
      example.output,
    );
    expect(runAlloyPercentageMassShare(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runAlloyPercentageMassShare({
      ...example.input,
      componentWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runAlloyPercentageMassShare({ ...example.input, totalWeightGrams: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "totalWeightGrams" }] },
    });
  });
});
