import { describe, expect, it } from "vitest";
import { calculateProgressiveTax, progressiveTaxExample } from "./tool.js";

describe("progressive tax", () => {
  it("calculates the canonical progressive schedule", () => {
    expect(calculateProgressiveTax(progressiveTaxExample.input)).toEqual({
      ok: true,
      output: progressiveTaxExample.output,
    });
  });

  it.each([
    null,
    { brackets: [], income: 10 },
    { brackets: [{ rate: 0.2, upTo: 10 }], income: 5 },
    {
      brackets: [
        { rate: 0.2, upTo: 10 },
        { rate: 0.3, upTo: 5 },
        { rate: 0.4, upTo: null },
      ],
      income: 5,
    },
  ])("rejects an invalid schedule %#", (input) => {
    expect(calculateProgressiveTax(input).ok).toBe(false);
  });
});
