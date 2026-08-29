import { describe, expect, it } from "vitest";
import { calculateCountingBloomFilter } from "./tool.js";

describe("countingBloomFilterTool", () => {
  it("retains a duplicate after removing one insertion", () => {
    const result = calculateCountingBloomFilter(
      ["banana", "banana"],
      ["banana"],
      "banana",
      128,
      3,
    );
    expect(result.possiblyPresent).toBe(true);
    expect(result.estimatedQueryMultiplicity).toBe(1);
    expect(result.successfulRemovals).toBe(1);
  });

  it("does not underflow counters for an unavailable removal", () => {
    const result = calculateCountingBloomFilter(
      [],
      ["missing"],
      "missing",
      64,
      3,
    );
    expect(result.successfulRemovals).toBe(0);
    expect(result.possiblyPresent).toBe(false);
  });
});
