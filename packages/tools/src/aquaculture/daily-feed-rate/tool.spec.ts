import { describe, expect, it } from "vitest";
import { calculateDailyFeedRate, example, runDailyFeedRate } from "./tool.js";

describe("aquaculture/daily-feed-rate", () => {
  it("calculates the published example", () => {
    expect(calculateDailyFeedRate(example.input)).toEqual(example.output);
    expect(runDailyFeedRate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runDailyFeedRate({
      ...example.input,
      biomassKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
