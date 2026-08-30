import { describe, expect, it } from "vitest";
import {
  calculateUnderinsuredCoverageRatioChecker,
  example,
  runUnderinsuredCoverageRatioChecker,
} from "./tool.js";

describe("numismatics/underinsured-coverage-ratio-checker", () => {
  it("calculates the published example", () => {
    expect(calculateUnderinsuredCoverageRatioChecker(example.input)).toEqual(
      example.output,
    );
    expect(runUnderinsuredCoverageRatioChecker(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runUnderinsuredCoverageRatioChecker({
      ...example.input,
      insuranceLimit: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runUnderinsuredCoverageRatioChecker({
        ...example.input,
        collectionValue: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "collectionValue" }] },
    });
  });
});
