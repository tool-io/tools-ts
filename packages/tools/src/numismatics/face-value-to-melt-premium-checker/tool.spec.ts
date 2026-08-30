import { describe, expect, it } from "vitest";
import {
  calculateFaceValueToMeltPremiumChecker,
  example,
  runFaceValueToMeltPremiumChecker,
} from "./tool.js";

describe("numismatics/face-value-to-melt-premium-checker", () => {
  it("calculates the published example", () => {
    expect(calculateFaceValueToMeltPremiumChecker(example.input)).toEqual(
      example.output,
    );
    expect(runFaceValueToMeltPremiumChecker(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runFaceValueToMeltPremiumChecker({
      ...example.input,
      meltValue: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runFaceValueToMeltPremiumChecker({ ...example.input, faceValue: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "faceValue" }] },
    });
  });
});
