import { describe, expect, it } from "vitest";
import tool, { example, calculateLruCacheRequestTrace } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("LRU request trace", () => {
  lightweightModelTests(tool, calculateLruCacheRequestTrace, example);
  it("lightweight independently preserves complete locality and special literal keys", () => {
    const result = tool.execute(
      {
        keys: ["__proto__", ""],
        capacity: 1,
        eventCount: 4,
        burstLength: 1,
        localityProbability: 1,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected locality workload");
    expect(result.output.requests).toEqual([
      "__proto__",
      "__proto__",
      "__proto__",
      "__proto__",
    ]);
    expect(result.output.hitCount).toBe(3);
    expect(result.output.counts).toEqual([{ key: "__proto__", count: 4 }]);
  });
  it("lightweight rejects capacity beyond the key universe", () => {
    expect(tool.execute({ ...example.input, capacity: 4 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "capacity", code: "capacity_range" }] },
    });
  });
});
