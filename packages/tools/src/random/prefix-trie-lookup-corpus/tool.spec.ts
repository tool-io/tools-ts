import { describe, expect, it } from "vitest";
import tool, { example, calculatePrefixTrieLookupCorpus } from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("Constructed prefix trie", () => {
  lightweightModelTests(tool, calculatePrefixTrieLookupCorpus, example);
  it("lightweight independently lists empty-prefix descendants while counting duplicate words", () => {
    const result = tool.execute(
      { words: ["car", "cat", "car"], queryCount: 1 },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected trie");
    expect(result.output.wordCounts).toEqual([
      { word: "car", count: 2 },
      { word: "cat", count: 1 },
    ]);
    expect(result.output.nodes).toHaveLength(5);
    expect(result.output.queries).toEqual([
      { prefix: "", visitedIds: [0], found: true, matches: ["car", "cat"] },
    ]);
  });
  it("lightweight retains a missing-edge witness and rejects trailing token text", () => {
    const missing = tool.execute(
      { words: ["cat"], queryCount: 1 },
      { random: () => 0.999 },
    );
    expect(missing).toMatchObject({
      ok: true,
      output: {
        queries: [
          {
            prefix: "cat#",
            visitedIds: [0, 1, 2, 3],
            found: false,
            matches: [],
          },
        ],
      },
    });
    expect(tool.execute({ ...example.input, words: ["cat\n"] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "words", code: "invalid_field" }] },
    });
  });
});
