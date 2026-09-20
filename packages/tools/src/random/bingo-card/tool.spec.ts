import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  bingoCardExample as example,
  calculateBingoCard,
} from "./tool.js";

describe("Random Configurable Bingo Card Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateBingoCard(example.input)).toEqual({
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
  it("checks all bounds, uniqueness and exactly one declared free cell", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({ ...example.input, seed });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output,
        filled: number[] = [];
      out.board.values.forEach((row, y) =>
        row.forEach((value, x) => {
          if (y === 1 && x === 1) expect(value).toBe(null);
          else {
            if (value === null) throw new Error("Unexpected free cell");
            expect(value).toBeGreaterThanOrEqual(
              example.input.columnBounds[x].minimum,
            );
            expect(value).toBeLessThanOrEqual(
              example.input.columnBounds[x].maximum,
            );
            filled.push(value);
          }
        }),
      );
      expect(new Set(filled).size).toBe(8);
      expect(out.uniqueNumbers).toEqual([...filled].sort((a, b) => a - b));
      expect(out.filledCellCount).toBe(8);
      expect(out.searchSteps).toBeLessThanOrEqual(10000);
    }
  });
  it("solves overlapping ranges by reassignment and distinguishes global from per-column uniqueness", () => {
    const solved = tool.execute({
      rows: 1,
      columnBounds: [
        { minimum: 1, maximum: 1 },
        { minimum: 1, maximum: 2 },
        { minimum: 2, maximum: 3 },
      ],
      uniqueness: "card",
      maximumSearchSteps: 1000,
      seed: 42,
    });
    if (!solved.ok) throw new Error("Expected success");
    expect(solved.output.uniqueNumbers).toEqual([1, 2, 3]);
    const common = {
      rows: 2,
      columnBounds: [
        { minimum: 1, maximum: 2 },
        { minimum: 1, maximum: 2 },
      ],
      maximumSearchSteps: 1000,
      seed: 42,
    };
    expect(tool.execute({ ...common, uniqueness: "card" })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "columnBounds", code: "infeasible_bingo_card" }],
      },
    });
    const columns = tool.execute({ ...common, uniqueness: "column" });
    if (!columns.ok) throw new Error("Expected success");
    for (let col = 0; col < 2; col += 1)
      expect(
        new Set(columns.output.board.values.map((row) => row[col])).size,
      ).toBe(2);
    expect(
      tool.execute({
        rows: 1,
        columnBounds: [
          { minimum: 1, maximum: 1 },
          { minimum: 1, maximum: 1 },
          { minimum: 2, maximum: 3 },
        ],
        uniqueness: "card",
        maximumSearchSteps: 1000,
        seed: 42,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "infeasible_bingo_card" }] },
    });
  });
  it("handles the all-free boundary and rejects invalid ranges and explicit resource limits", () => {
    const free = tool.execute({
      rows: 1,
      columnBounds: [{ minimum: 4, maximum: 4 }],
      uniqueness: "card",
      freeCell: { row: 0, column: 0 },
      maximumSearchSteps: 10,
      seed: 42,
    });
    if (!free.ok) throw new Error("Expected success");
    expect(free.output.board.values).toEqual([[null]]);
    expect(free.output.uniqueNumbers).toEqual([]);
    expect(free.output.filledCellCount).toBe(0);
    expect(
      tool.execute({ ...example.input, maximumSearchSteps: 1 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumSearchSteps", code: "resource_limit" }],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        columnBounds: [{ minimum: 0, maximum: 512 }],
        freeCell: { row: 0, column: 0 },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "columnBounds", code: "resource_limit" }] },
    });
    expect(
      tool.execute({ ...example.input, freeCell: { row: 3, column: 0 } }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "freeCell", code: "free_cell_outside_board" }],
      },
    });
  });
});
