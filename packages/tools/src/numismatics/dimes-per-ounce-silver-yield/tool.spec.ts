import { describe, expect, it } from "vitest";
import {
  calculateDimesPerOunceSilverYield,
  example,
  runDimesPerOunceSilverYield,
} from "./tool.js";

describe("numismatics/dimes-per-ounce-silver-yield", () => {
  it("calculates the published example", () => {
    expect(calculateDimesPerOunceSilverYield(example.input)).toEqual(
      example.output,
    );
    expect(runDimesPerOunceSilverYield(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runDimesPerOunceSilverYield({
      ...example.input,
      fineSilverGramsPerDime: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runDimesPerOunceSilverYield({
        ...example.input,
        fineSilverGramsPerDime: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "fineSilverGramsPerDime" }] },
    });
  });
});
