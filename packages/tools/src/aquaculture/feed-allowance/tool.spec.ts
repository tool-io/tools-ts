import { describe, expect, it } from "vitest";
import { calculateFeedAllowance, example, runFeedAllowance } from "./tool.js";

describe("aquaculture/feed-allowance", () => {
  it("calculates the published example", () => {
    expect(calculateFeedAllowance(example.input)).toEqual(example.output);
    expect(runFeedAllowance(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runFeedAllowance({
      ...example.input,
      dailyFeedKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
