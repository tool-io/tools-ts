import { describe, expect, it } from "vitest";
import {
  bloomFilterExample,
  calculateBloomFilter,
  runBloomFilter,
} from "./tool.js";

describe("Bloom Filter", () => {
  it("never rejects an inserted item", () =>
    expect(calculateBloomFilter(["a", "b"], "b", 64, 3).possiblyPresent).toBe(
      true,
    ));
  it("deduplicates inserted items", () =>
    expect(calculateBloomFilter(["a", "a"], "a", 64, 3).itemCount).toBe(1));
  it("publishes an executable example", () =>
    expect(runBloomFilter(bloomFilterExample.input)).toEqual({
      ok: true,
      output: bloomFilterExample.output,
    }));
});
