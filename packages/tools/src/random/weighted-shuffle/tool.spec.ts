import { describe, expect, it } from "vitest";
import tool, {
  calculateWeightedShuffle,
  weightedShuffleExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateWeightedShuffle, example);
  it("keeps source-position mass distinct from aggregated value mass", () => {
    const result = calculateWeightedShuffle(
      {
        candidates: [
          { value: "x", weight: 1 },
          { value: "x", weight: 3 },
          { value: "y", weight: 2 },
        ],
        uniqueness: "value",
        zeroWeightPolicy: "append",
      },
      { random: () => 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        order: [
          { sourceIndex: 0, value: "x", selection: { probability: 1 / 6 } },
          { sourceIndex: 2, value: "y", selection: { probability: 1 } },
        ],
        omittedIndices: [1],
      },
    });
  });
  it("never delegates a zero-weight position at either draw endpoint or a subnormal tail", () => {
    for (const value of [0, 1 - Number.EPSILON])
      for (const weights of [
        [0, 5, 0],
        [0, Number.MIN_VALUE, 0],
      ]) {
        const result = calculateWeightedShuffle(
          {
            candidates: weights.map((weight, i) => ({
              value: String(i),
              weight,
            })),
            uniqueness: "position",
            zeroWeightPolicy: "omit",
          },
          { random: () => value },
        );
        expect(result).toMatchObject({
          ok: true,
          output: {
            order: [
              {
                sourceIndex: 1,
                selection: { probability: 1, kind: "weighted" },
              },
            ],
            omittedIndices: [0, 2],
          },
        });
      }
  });
  it("preserves position multiplicity and appends each zero value only once in value mode", () => {
    const candidates = [
      { value: "x", weight: 0 },
      { value: "x", weight: 0 },
      { value: "y", weight: 0 },
    ];
    expect(
      calculateWeightedShuffle({
        candidates,
        uniqueness: "value",
        zeroWeightPolicy: "append",
      }),
    ).toMatchObject({
      ok: true,
      output: {
        order: [{ sourceIndex: 0 }, { sourceIndex: 2 }],
        omittedIndices: [1],
      },
    });
    expect(
      calculateWeightedShuffle({
        candidates,
        uniqueness: "position",
        zeroWeightPolicy: "append",
      }),
    ).toMatchObject({
      ok: true,
      output: {
        order: [{ sourceIndex: 0 }, { sourceIndex: 1 }, { sourceIndex: 2 }],
      },
    });
  });
  it("delegates large pools through block masses without exceeding the legacy128-label limit", () => {
    let calls = 0;
    const result = calculateWeightedShuffle(
      {
        candidates: Array.from({ length: 129 }, (_, i) => ({
          value: String(i),
          weight: i === 128 ? 2 : 0,
        })),
        uniqueness: "position",
        zeroWeightPolicy: "omit",
      },
      {
        random: () => {
          calls += 1;
          return 0;
        },
      },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        order: [
          {
            sourceIndex: 128,
            weight: 2,
            selection: { probability: 1, kind: "weighted" },
          },
        ],
      },
    });
    expect(calls).toBe(2);
  });
  it("retains every position exactly once across sampled and omitted output", () => {
    for (let seed = 0; seed < 8; seed += 1) {
      const result = calculateWeightedShuffle({ ...example.input, seed });
      if (!result.ok) throw new Error("Expected success");
      expect(
        [
          ...result.output.order.map((entry) => entry.sourceIndex),
          ...result.output.omittedIndices,
        ].sort(),
      ).toEqual([0, 1, 2]);
      expect(
        result.output.order
          .filter((entry) => entry.selection.kind === "weighted")
          .every((entry) => entry.weight > 0),
      ).toBe(true);
    }
  });
  it("rejects negative, nonfinite, overflowing and oversized weighted collections", () => {
    expect(
      tool.execute({
        ...example.input,
        candidates: [{ value: "x", weight: -1 }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "candidates", code: "invalid_field" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        candidates: [
          { value: "x", weight: Number.MAX_VALUE },
          { value: "y", weight: Number.MAX_VALUE },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "candidates", code: "invalid_weight_total" }],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        candidates: Array.from({ length: 513 }, (_, i) => ({
          value: String(i),
          weight: 1,
        })),
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "candidates", code: "invalid_field" }] },
    });
    expect(tool.execute({ ...example.input, candidates: [] })).toMatchObject({
      ok: true,
      output: { order: [], omittedIndices: [] },
    });
  });
});
