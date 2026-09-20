import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  missingValueTableExample as example,
  calculateMissingValueTable,
} from "./tool.js";
import { validateTableData } from "../../table/definition.js";

describe("Random Missing-Value Table Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMissingValueTable(example.input)).toEqual({
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
  it("has independently known quoted cells, primitive types and portable table data", () => {
    const result = tool.execute({
      rowCount: 1,
      columns: [
        { key: "message", kind: "text", choices: ['say "hi", now\nnext'] },
        { key: "amount", kind: "integer", minimum: -3, maximum: -3 },
        { key: "flag", kind: "boolean", trueProbability: 1 },
      ],
      delimiter: ",",
      missingProbability: 0,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.records).toEqual([
      { message: 'say "hi", now\nnext', amount: -3, flag: true },
    ]);
    expect(result.output.csv).toBe(
      'message,amount,flag\n"say ""hi"", now\nnext",-3,true\n',
    );
    expect(validateTableData(result.output.table)).toEqual([]);
    expect(result.output.table.rows).toEqual([
      ['say "hi", now\nnext', -3, true],
    ]);
  });
  it("generates rather than samples caller-precomputed records and preserves metadata", () => {
    const result = tool.execute({
      ...example.input,
      rowCount: 30,
      columns: [
        { key: "x", kind: "number", minimum: -2, maximum: 3 },
        { key: "tag", kind: "text", choices: ["north", "south"] },
      ],
      missingProbability: 0,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.records).toHaveLength(30);
    for (const record of result.output.records) {
      expect(record.x).toBeGreaterThanOrEqual(-2);
      expect(record.x).toBeLessThanOrEqual(3);
      expect(["north", "south"]).toContain(record.tag);
    }
    expect(validateTableData(result.output.table)).toEqual([]);
  });
  it("retains the exact injected mask including complete missing columns", () => {
    for (const missingProbability of [0, 0.35, 1]) {
      const result = tool.execute({ ...example.input, missingProbability });
      if (!result.ok) throw new Error("Expected success");
      result.output.records.forEach((record, row) =>
        example.input.columns.forEach((column, col) => {
          expect(record[column.key]).toBe(
            result.output.missingMask[row][col]
              ? null
              : result.output.completeRecords[row][column.key],
          );
          expect(result.output.missingMask[row][col]).toBe(
            record[column.key] === null,
          );
        }),
      );
      expect(validateTableData(result.output.table)).toEqual([]);
      if (missingProbability === 1)
        expect(
          result.output.table.schema.fields.every(
            (field) => field.nullable && field.dataType.kind === "json",
          ),
        ).toBe(true);
    }
  });
  it("rejects duplicate keys, reversed bounds, unsafe integers and unquoted-header hazards", () => {
    expect(
      tool.execute({
        ...example.input,
        columns: [example.input.columns[0], example.input.columns[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "columns", code: "duplicate_field_keys" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        columns: [{ key: "x", kind: "integer", minimum: 2, maximum: 1 }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "columns", code: "invalid_integer_range" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        columns: [
          { key: "x", kind: "number", minimum: -1e308, maximum: 1e308 },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "columns", code: "invalid_number_range" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        columns: [{ key: "bad,header", kind: "text", choices: ["ok"] }],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "columns", code: "unsupported_column_name" }],
      },
    });
  });
});
