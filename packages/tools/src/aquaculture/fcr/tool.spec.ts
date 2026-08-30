import { describe, expect, it } from "vitest";
import { calculateFcr, example, runFcr } from "./tool.js";

describe("aquaculture/fcr", () => {
  it("calculates the published example", () => {
    expect(calculateFcr(example.input)).toEqual(example.output);
    expect(runFcr(example.input)).toEqual({ ok: true, output: example.output });
  });
  it("rejects a non-finite input", () => {
    const result = runFcr({
      ...example.input,
      feedConsumedKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateFcr({ feedConsumedKilograms: 100, biomassGainKilograms: 50 })
        .feedConversionRatio,
    ).toBe(2);
  });
  it("rejects a zero denominator", () => {
    expect(runFcr({ ...example.input, biomassGainKilograms: 0 })).toMatchObject(
      {
        ok: false,
        error: { issues: [{ field: "biomassGainKilograms" }] },
      },
    );
  });
});
