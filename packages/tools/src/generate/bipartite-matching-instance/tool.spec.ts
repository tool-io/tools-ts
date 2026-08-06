import { describe, expect, it } from "vitest";
import {
  bipartiteMatchingInstanceExample,
  generateBipartiteMatchingInstance,
  runBipartiteMatchingInstance,
} from "./tool.js";
describe("Bipartite Matching Instance", () => {
  it("generates all edges at probability one", () =>
    expect(
      generateBipartiteMatchingInstance(2, 3, 1, "seed")?.edges,
    ).toHaveLength(6));
  it("publishes an executable example", () =>
    expect(
      runBipartiteMatchingInstance(bipartiteMatchingInstanceExample.input),
    ).toEqual({ ok: true, output: bipartiteMatchingInstanceExample.output }));
});
