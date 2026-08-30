import { describe, expect, it } from "vitest";
import {
  calculateOffCenterStrikePercent,
  example,
  runOffCenterStrikePercent,
} from "./tool.js";

describe("numismatics/off-center-strike-percent", () => {
  it("calculates the published example", () => {
    expect(calculateOffCenterStrikePercent(example.input)).toEqual(
      example.output,
    );
    expect(runOffCenterStrikePercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runOffCenterStrikePercent({
      ...example.input,
      designOffsetMillimeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runOffCenterStrikePercent({
        ...example.input,
        planchetDiameterMillimeters: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "planchetDiameterMillimeters" }] },
    });
  });
});
