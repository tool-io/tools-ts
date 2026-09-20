import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  csvPivotPracticeDatasetExample as example,
  calculateCsvPivotPracticeDataset,
} from "./tool.js";

describe("Random CSV Pivot Practice Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCsvPivotPracticeDataset(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("matches independent aggregation over exact repeated groups and omits missing values except when counting", () => {
    for (const aggregation of ["count", "sum", "mean", "min", "max"]) {
      const result = tool.execute({
        ...example.input,
        categories: [
          ["a", "b"],
          ["x", "y", "z"],
        ],
        rowCount: 40,
        distinctGroupCount: 4,
        minimumValue: -5,
        maximumValue: 8,
        aggregation,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const buckets = new Map<string, (number | null)[]>();
      for (const row of result.output.rows) {
        const key = JSON.stringify(row.group);
        buckets.set(key, [...(buckets.get(key) ?? []), row.value]);
      }
      expect(buckets.size).toBe(4);
      expect(result.output.table.rows).toHaveLength(4);
      for (const row of result.output.table.rows) {
        const values = buckets.get(JSON.stringify(row.slice(0, 2)));
        if (!values)
          throw new Error(
            "Each pivot row must identify an independently observed group.",
          );
        const numeric = values.filter(
            (value): value is number => value !== null,
          ),
          sum = numeric.reduce((total, value) => total + value, 0);
        const expected =
          aggregation === "count"
            ? values.length
            : numeric.length === 0
              ? 0
              : aggregation === "sum"
                ? sum
                : aggregation === "mean"
                  ? sum / numeric.length
                  : aggregation === "min"
                    ? Math.min(...numeric)
                    : Math.max(...numeric);
        expect(row[2]).toBe(expected);
      }
      expect(result.output.missingValueCount).toBe(
        result.output.rows.filter((row) => row.value === null).length,
      );
    }
  });
  it("preserves all-missing group zero and row-count conventions", () => {
    expect(
      tool.execute({ ...example.input, missingProbability: 1 }),
    ).toMatchObject({
      ok: true,
      output: {
        missingValueCount: 4,
        table: {
          rows: [
            ["east", 0],
            ["west", 0],
          ],
        },
      },
    });
    const counted = tool.execute({
      ...example.input,
      missingProbability: 1,
      aggregation: "count",
    });
    expect(counted.ok).toBe(true);
    if (counted.ok)
      expect(
        counted.output.table.rows.reduce(
          (sum, row) => sum + (row[1] as number),
          0,
        ),
      ).toBe(4);
  });
  it("rejects impossible groups, NUL key collisions, unsupported values, and resource excess", () => {
    for (const change of [
      { distinctGroupCount: 3 },
      { rowCount: 1 },
      { categories: [["a", "a"]] },
      { categories: [["a\u0000b"]] },
      { minimumValue: 6 },
      { rowCount: 257 },
      { aggregation: "median" },
      { missingProbability: 1.1 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
