import { describe, expect, it } from "vitest";
import {
  calculateUnionizedAmmonia,
  example,
  runUnionizedAmmonia,
} from "./tool.js";

describe("aquaculture/unionized-ammonia", () => {
  it("calculates the published example", () => {
    expect(calculateUnionizedAmmonia(example.input)).toEqual(example.output);
    expect(runUnionizedAmmonia(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runUnionizedAmmonia({
      ...example.input,
      totalAmmoniaNitrogenMgPerLiter: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateUnionizedAmmonia({
        totalAmmoniaNitrogenMgPerLiter: 2,
        unionizedFractionPercent: 5,
      }).unionizedAmmoniaNitrogenMgPerLiter,
    ).toBe(0.1);
  });
});
