import { describe, expect, it } from "vitest";
import {
  calculateAppraisalAverageValuePerItem,
  example,
  runAppraisalAverageValuePerItem,
} from "./tool.js";

describe("numismatics/appraisal-average-value-per-item", () => {
  it("calculates the published example", () => {
    expect(calculateAppraisalAverageValuePerItem(example.input)).toEqual(
      example.output,
    );
    expect(runAppraisalAverageValuePerItem(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runAppraisalAverageValuePerItem({
      ...example.input,
      totalAppraisedValue: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runAppraisalAverageValuePerItem({ ...example.input, itemCount: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "itemCount" }] },
    });
  });
});
