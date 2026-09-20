import { describe, expect, it } from "vitest";
import tool, { example, calculateLfuCacheTieBreakTrace } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("LFU eviction ties", () => {
  it("lightweight capacity one is a single-candidate eviction control, not a tie", () => {
    const result = tool.execute({
      ...example.input,
      capacity: 1,
      extraRequests: 0,
    });
    if (!result.ok) throw new Error("Expected degenerate eviction control");
    expect(result.output.events[1]?.tieCandidates).toHaveLength(1);
    expect(result.output.events[1]?.evicted).toBe(result.output.requests[0]);
  });
  lightweightModelTests(tool, calculateLfuCacheTieBreakTrace, example);
  it("lightweight independently distinguishes FIFO and lexical tie choices", () => {
    const lexical = tool.execute({
      ...example.input,
      extraRequests: 0,
      tiePolicy: "lexicographic",
    });
    if (!lexical.ok) throw new Error("Expected tie fixture");
    expect(lexical.output.requests).toEqual(["c", "a", "b"]);
    expect(lexical.output.events[2]).toMatchObject({
      tieCandidates: ["c", "a"],
      evicted: "a",
      residents: [
        { key: "c", count: 1 },
        { key: "b", count: 1 },
      ],
    });
    expect(example.output.events[3]?.residents).toEqual([
      { key: "b", count: 1 },
      { key: "c", count: 1 },
    ]);
  });
  it("lightweight rejects an impossible planted eviction", () => {
    expect(tool.execute({ ...example.input, capacity: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "capacity", code: "insufficient_tie_keys" }] },
    });
  });
});
