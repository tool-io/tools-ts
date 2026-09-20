import { describe, expect, it } from "vitest";
import tool, {
  calculateNegativePairSampler,
  negativePairSamplerExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateNegativePairSampler, example);
  it("canonicalizes reversed unordered positives, including duplicate exclusions", () => {
    const result = calculateNegativePairSampler({
      ...example.input,
      positives: [
        { first: "B", second: "A" },
        { first: "A", second: "B" },
      ],
    });
    expect(result).toEqual({ ok: true, output: example.output });
  });
  it("distinguishes ordered directions and permits explicitly requested self pairs", () => {
    const result = calculateNegativePairSampler(
      {
        itemIds: ["a", "b"],
        positives: [{ first: "a", second: "b" }],
        convention: "ordered",
        allowSelfPairs: false,
        count: 1,
        replacement: false,
      },
      { random: () => 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        eligiblePairCount: 1,
        pairs: [{ first: "b", second: "a", conditionalProbability: 1 }],
      },
    });
    expect(
      tool.execute({
        itemIds: ["a"],
        positives: [],
        convention: "unordered",
        allowSelfPairs: true,
        count: 2,
        replacement: true,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        eligiblePairCount: 1,
        pairs: [
          { first: "a", second: "a", conditionalProbability: 1 },
          { first: "a", second: "a", conditionalProbability: 1 },
        ],
      },
    });
  });
  it("enumerates the whole allowed ordered pair space without repeats", () => {
    const result = tool.execute({
      ...example.input,
      convention: "ordered",
      positives: [],
      count: 6,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(
      new Set(result.output.pairs.map((pair) => `${pair.first}${pair.second}`)),
    ).toEqual(new Set(["AB", "AC", "BA", "BC", "CA", "CB"]));
    expect(
      result.output.pairs.map((pair) => pair.conditionalProbability),
    ).toEqual([1 / 6, 1 / 5, 1 / 4, 1 / 3, 1 / 2, 1]);
    const { seed, ...input } = example.input;
    expect(
      calculateNegativePairSampler(
        { ...input, replacement: true },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        pairs: [
          { first: "A", second: "C", conditionalProbability: 0.5 },
          { first: "A", second: "C", conditionalProbability: 0.5 },
        ],
      },
    });
  });
  it("rejects exhausted pair spaces, unknown endpoints, duplicate IDs and oversized counts", () => {
    expect(tool.execute({ ...example.input, count: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "exhausted_pair_space" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        positives: [{ first: "A", second: "unknown" }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "positives", code: "unknown_pair_item" }] },
    });
    expect(
      tool.execute({ ...example.input, itemIds: ["A", "A"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "itemIds", code: "duplicate_id" }] },
    });
    expect(tool.execute({ ...example.input, count: 4097 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
    expect(
      tool.execute({ ...example.input, itemIds: [], positives: [], count: 0 }),
    ).toMatchObject({ ok: true, output: { pairs: [], eligiblePairCount: 0 } });
  });
});
