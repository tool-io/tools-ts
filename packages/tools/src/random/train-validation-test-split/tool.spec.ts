import { describe, expect, it } from "vitest";
import tool, {
  calculateTrainValidationTestSplit,
  trainValidationTestSplitExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateTrainValidationTestSplit, example);
  it("satisfies exact stratum quotas without group constraints", () => {
    const result = tool.execute({
      ...example.input,
      sizes: { train: 2, validation: 0, test: 2 },
      stratification: "exact",
      stratumQuotas: [
        { stratum: "oak", train: 1, validation: 0, test: 1 },
        { stratum: "pine", train: 1, validation: 0, test: 1 },
      ],
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.strata).toEqual([
      { stratum: "oak", train: 1, validation: 0, test: 1 },
      { stratum: "pine", train: 1, validation: 0, test: 1 },
    ]);
    expect(result.output.validation).toEqual([]);
    expect(new Set([...result.output.train, ...result.output.test])).toEqual(
      new Set(["a", "b", "c", "d"]),
    );
  });
  it("keeps mixed-stratum groups intact while solving exact row/stratum counts", () => {
    const rows = [
      { id: "a", group: "g1", stratum: "red" },
      { id: "b", group: "g1", stratum: "blue" },
      { id: "c", group: "g2", stratum: "red" },
      { id: "d", group: "g2", stratum: "blue" },
    ];
    const result = calculateTrainValidationTestSplit(
      {
        rows,
        sizes: { train: 2, validation: 0, test: 2 },
        grouping: "group",
        stratification: "exact",
        stratumQuotas: [
          { stratum: "red", train: 1, validation: 0, test: 1 },
          { stratum: "blue", train: 1, validation: 0, test: 1 },
        ],
      },
      { random: () => 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        train: ["a", "b"],
        validation: [],
        test: ["c", "d"],
        groups: [
          { group: "g1", splits: ["train"] },
          { group: "g2", splits: ["test"] },
        ],
      },
    });
  });
  it("rejects exact totals that cannot be realized by whole groups", () => {
    expect(
      tool.execute({
        ...example.input,
        rows: example.input.rows.map((row) => ({ ...row, group: "same" })),
        grouping: "group",
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "grouping", code: "infeasible_group_split" }],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        sizes: { train: 1, validation: 1, test: 1 },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "sizes", code: "infeasible_sizes" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        stratification: "exact",
        stratumQuotas: [],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "stratumQuotas", code: "infeasible_stratum_quotas" }],
      },
    });
  });
  it("preserves a complete disjoint partition across seeds and bounds resource inputs", () => {
    for (let seed = 0; seed < 8; seed += 1) {
      const result = tool.execute({ ...example.input, seed });
      if (!result.ok) throw new Error("Expected success");
      const ids = [
        ...result.output.train,
        ...result.output.validation,
        ...result.output.test,
      ];
      expect(ids).toHaveLength(4);
      expect(new Set(ids).size).toBe(4);
      expect([
        result.output.train.length,
        result.output.validation.length,
        result.output.test.length,
      ]).toEqual([2, 1, 1]);
    }
    expect(
      tool.execute({
        ...example.input,
        rows: Array.from({ length: 129 }, (_, i) => ({
          id: String(i),
          group: String(i),
          stratum: "s",
        })),
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "rows", code: "invalid_field" }] },
    });
    expect(
      tool.execute({
        rows: [],
        sizes: { train: 0, validation: 0, test: 0 },
        grouping: "group",
        stratification: "none",
        stratumQuotas: [],
      }),
    ).toMatchObject({
      ok: true,
      output: { train: [], validation: [], test: [], groups: [] },
    });
  });
});
