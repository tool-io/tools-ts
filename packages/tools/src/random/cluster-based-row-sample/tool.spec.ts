import { describe, expect, it } from "vitest";
import tool, {
  calculateClusterBasedRowSample,
  clusterBasedRowSampleExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateClusterBasedRowSample, example);
  it("distinguishes size-weighted and uniform cluster mass while retaining all members", () => {
    const { seed, ...input } = example.input;
    const result = calculateClusterBasedRowSample(
      { ...input, weighting: "proportional-size" },
      { random: () => 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        clusters: [{ weight: 2 }, { weight: 1 }],
        draws: [
          {
            cluster: "west",
            conditionalProbability: 2 / 3,
            rows: [input.rows[0], input.rows[1]],
          },
          { cluster: "east", conditionalProbability: 1, rows: [input.rows[2]] },
        ],
      },
    });
  });
  it("repeats every row for repeated cluster draws instead of deduplicating results", () => {
    const { seed, ...input } = example.input;
    const result = calculateClusterBasedRowSample(
      { ...input, replacement: true },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(
      result.output.draws.map((draw) => draw.rows.map((row) => row.id)),
    ).toEqual([
      ["a", "b"],
      ["a", "b"],
    ]);
    expect(result.output.returnedRowCount).toBe(4);
    expect(
      result.output.draws.map((draw) => draw.conditionalProbability),
    ).toEqual([0.5, 0.5]);
  });
  it("samples each cluster once without replacement and keeps every original row", () => {
    for (let seed = 0; seed < 6; seed += 1) {
      const result = tool.execute({ ...example.input, seed });
      if (!result.ok) throw new Error("Expected success");
      expect(
        new Set(
          result.output.draws.flatMap((draw) => draw.rows.map((row) => row.id)),
        ),
      ).toEqual(new Set(["a", "b", "c"]));
    }
  });
  it("supports more than128 size-weighted clusters through delegated block masses", () => {
    const result = calculateClusterBasedRowSample(
      {
        rows: Array.from({ length: 129 }, (_, i) => ({
          id: String(i),
          cluster: `c${i}`,
          values: [],
        })),
        count: 1,
        replacement: false,
        weighting: "proportional-size",
      },
      { random: () => 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        draws: [
          {
            cluster: "c0",
            conditionalProbability: 1 / 129,
            rows: [{ id: "0", cluster: "c0", values: [] }],
          },
        ],
      },
    });
  });
  it("rejects exhausted cluster counts and worst-case row expansion", () => {
    expect(tool.execute({ ...example.input, count: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "infeasible_cluster_count" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        rows: Array.from({ length: 65 }, (_, i) => ({
          id: String(i),
          cluster: "one",
          values: [],
        })),
        count: 128,
        replacement: true,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "resource_limit_exceeded" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        rows: [example.input.rows[0], example.input.rows[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "rows", code: "duplicate_id" }] },
    });
    expect(
      tool.execute({ ...example.input, rows: [], count: 0 }),
    ).toMatchObject({ ok: true, output: { draws: [], returnedRowCount: 0 } });
  });
});
