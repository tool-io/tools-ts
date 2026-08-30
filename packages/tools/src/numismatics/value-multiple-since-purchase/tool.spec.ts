import { describe, expect, it } from "vitest";
import {
  calculateValueMultipleSincePurchase,
  example,
  runValueMultipleSincePurchase,
} from "./tool.js";

describe("numismatics/value-multiple-since-purchase", () => {
  it("calculates the published example", () => {
    expect(calculateValueMultipleSincePurchase(example.input)).toEqual(
      example.output,
    );
    expect(runValueMultipleSincePurchase(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runValueMultipleSincePurchase({
      ...example.input,
      currentValue: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runValueMultipleSincePurchase({ ...example.input, purchaseCost: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "purchaseCost" }] },
    });
  });
});
