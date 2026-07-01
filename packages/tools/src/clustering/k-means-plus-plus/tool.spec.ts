import { describe, expect, it } from "vitest";
import { initializeKMeansPlusPlus } from "./tool.js";
describe("k-means++", () => {
  const input = { clusters: 2, points: [[0, 0], [1, 1], [10, 10], [11, 11]], seed: 42 };
  it("is deterministic for a seed", () => expect(initializeKMeansPlusPlus(input)).toEqual(initializeKMeansPlusPlus(input)));
  it("uses an injected random source without a seed", () => expect(initializeKMeansPlusPlus({ ...input, seed: undefined }, { random: () => 0 })).toMatchObject({ ok: true, output: { centroidIndices: [0, 1] } }));
  it("rejects ragged points", () => expect(initializeKMeansPlusPlus({ clusters: 1, points: [[1], [1, 2]] }).ok).toBe(false));
});
