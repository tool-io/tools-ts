import { describe, expect, it } from "vitest";
import { checkWaistCircumference, waistCircumferenceTool } from "./tool.js";

describe("waist circumference", () => {
  it("uses the NIDDK US adult thresholds", () => {
    expect(
      checkWaistCircumference({ sex: "female", waistCm: 88.9 }),
    ).toMatchObject({
      ok: true,
      output: { atOrAboveIncreasedRiskThreshold: true, thresholdCm: 88.9 },
    });
    expect(
      checkWaistCircumference({ sex: "male", waistCm: 100 }),
    ).toMatchObject({
      ok: true,
      output: { atOrAboveIncreasedRiskThreshold: false, thresholdCm: 101.6 },
    });
  });

  it("rejects malformed input without returning undefined", () => {
    expect(checkWaistCircumference({ sex: "other", waistCm: 0 })).toMatchObject(
      {
        error: { code: "invalid_input" },
        ok: false,
      },
    );
  });

  it("publishes a pure tool contract", () => {
    expect(waistCircumferenceTool).toMatchObject({
      execution: { kind: "pure" },
      id: "waist-circumference",
    });
  });
});
