import { describe, expect, it } from "vitest";
import {
  calculateFeedCostPerKgGain,
  example,
  runFeedCostPerKgGain,
} from "./tool.js";

describe("aquaculture/feed-cost-per-kg-gain", () => {
  it("calculates the published example", () => {
    expect(calculateFeedCostPerKgGain(example.input)).toEqual(example.output);
    expect(runFeedCostPerKgGain(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runFeedCostPerKgGain({
      ...example.input,
      feedConversionRatio: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
