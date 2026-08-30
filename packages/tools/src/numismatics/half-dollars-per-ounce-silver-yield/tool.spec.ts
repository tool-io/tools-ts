import { describe, expect, it } from "vitest";
import {
  calculateHalfDollarsPerOunceSilverYield,
  example,
  runHalfDollarsPerOunceSilverYield,
} from "./tool.js";

describe("numismatics/half-dollars-per-ounce-silver-yield", () => {
  it("calculates the published example", () => {
    expect(calculateHalfDollarsPerOunceSilverYield(example.input)).toEqual(
      example.output,
    );
    expect(runHalfDollarsPerOunceSilverYield(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runHalfDollarsPerOunceSilverYield({
      ...example.input,
      fineSilverGramsPerHalfDollar: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runHalfDollarsPerOunceSilverYield({
        ...example.input,
        fineSilverGramsPerHalfDollar: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "fineSilverGramsPerHalfDollar" }] },
    });
  });
});
