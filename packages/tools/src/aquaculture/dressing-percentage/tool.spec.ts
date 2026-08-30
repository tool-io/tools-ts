import { describe, expect, it } from "vitest";
import {
  calculateDressingPercentage,
  example,
  runDressingPercentage,
} from "./tool.js";

describe("aquaculture/dressing-percentage", () => {
  it("calculates the published example", () => {
    expect(calculateDressingPercentage(example.input)).toEqual(example.output);
    expect(runDressingPercentage(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runDressingPercentage({
      ...example.input,
      dressedWeightKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runDressingPercentage({ ...example.input, wholeWeightKilograms: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "wholeWeightKilograms" }] },
    });
  });
});
