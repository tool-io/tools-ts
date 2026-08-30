import { describe, expect, it } from "vitest";
import {
  calculateClippedPlanchetWeightLoss,
  example,
  runClippedPlanchetWeightLoss,
} from "./tool.js";

describe("numismatics/clipped-planchet-weight-loss", () => {
  it("calculates the published example", () => {
    expect(calculateClippedPlanchetWeightLoss(example.input)).toEqual(
      example.output,
    );
    expect(runClippedPlanchetWeightLoss(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runClippedPlanchetWeightLoss({
      ...example.input,
      standardWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runClippedPlanchetWeightLoss({
        ...example.input,
        standardWeightGrams: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "standardWeightGrams" }] },
    });
  });
});
