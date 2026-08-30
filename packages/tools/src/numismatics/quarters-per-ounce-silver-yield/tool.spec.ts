import { describe, expect, it } from "vitest";
import {
  calculateQuartersPerOunceSilverYield,
  example,
  runQuartersPerOunceSilverYield,
} from "./tool.js";

describe("numismatics/quarters-per-ounce-silver-yield", () => {
  it("calculates the published example", () => {
    expect(calculateQuartersPerOunceSilverYield(example.input)).toEqual(
      example.output,
    );
    expect(runQuartersPerOunceSilverYield(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runQuartersPerOunceSilverYield({
      ...example.input,
      fineSilverGramsPerQuarter: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runQuartersPerOunceSilverYield({
        ...example.input,
        fineSilverGramsPerQuarter: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "fineSilverGramsPerQuarter" }] },
    });
  });
});
