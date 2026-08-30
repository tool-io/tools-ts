import { describe, expect, it } from "vitest";
import {
  calculateBagFaceSilverDollarCount,
  example,
  runBagFaceSilverDollarCount,
} from "./tool.js";

describe("numismatics/bag-face-silver-dollar-count", () => {
  it("calculates the published example", () => {
    expect(calculateBagFaceSilverDollarCount(example.input)).toEqual(
      example.output,
    );
    expect(runBagFaceSilverDollarCount(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runBagFaceSilverDollarCount({
      ...example.input,
      bagFaceValueDollars: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runBagFaceSilverDollarCount({
        ...example.input,
        coinFaceValueDollars: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "coinFaceValueDollars" }] },
    });
  });
});
