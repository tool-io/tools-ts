import { describe, expect, it } from "vitest";
import {
  cosineSimilarity,
  cosineSimilarityExample,
  runCosineSimilarity,
} from "./tool.js";

describe("Cosine Similarity", () => {
  it("compares parallel and perpendicular vectors", () => {
    expect(cosineSimilarity("1,2", "2,4")).toBe(1);
    expect(cosineSimilarity("1,0", "0,1")).toBe(0);
  });
  it("rejects incompatible vectors", () =>
    expect(runCosineSimilarity({ first: "1,2", second: "1" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runCosineSimilarity(cosineSimilarityExample.input)).toEqual({
      ok: true,
      output: cosineSimilarityExample.output,
    }));
});
