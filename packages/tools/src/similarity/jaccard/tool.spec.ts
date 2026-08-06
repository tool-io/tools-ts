import { describe, expect, it } from "vitest";
import {
  jaccardSimilarity,
  jaccardSimilarityExample,
  runJaccardSimilarity,
} from "./tool.js";

describe("Jaccard Similarity", () => {
  it("compares set membership", () =>
    expect(jaccardSimilarity("a,b,c", "b,c,d")).toBe(0.5));
  it("deduplicates repeated members", () =>
    expect(jaccardSimilarity("a,a", "a")).toBe(1));
  it("rejects empty sets", () =>
    expect(runJaccardSimilarity({ first: "", second: "a" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runJaccardSimilarity(jaccardSimilarityExample.input)).toEqual({
      ok: true,
      output: jaccardSimilarityExample.output,
    }));
});
