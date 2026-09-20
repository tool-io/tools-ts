import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  payoffMatrixGameExample as example,
  calculatePayoffMatrixGame,
} from "./tool.js";

describe("Random Payoff Matrix Game Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculatePayoffMatrixGame(example.input)).toEqual({
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
  it("matches independent best-response inequalities and lowest-index row-then-column updates", () => {
    for (let seed = 0; seed < 12; seed += 1) {
      const result = tool.execute({
        ...example.input,
        rowStrategies: 4,
        columnStrategies: 3,
        minimumPayoff: -2,
        maximumPayoff: 2,
        iterations: 12,
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const { rowPayoffs: rows, columnPayoffs: columns } = result.output,
        expected: [number, number][] = [];
      for (let r = 0; r < 4; r += 1)
        for (let c = 0; c < 3; c += 1)
          if (
            rows.every((row) => row[c] <= rows[r][c]) &&
            columns[r].every((value) => value <= columns[r][c])
          )
            expected.push([r, c]);
      expect(
        result.output.equilibria.map((point) => [
          point.rowStrategy,
          point.columnStrategy,
        ]),
      ).toEqual(expected);
      let column = result.output.initial.columnAction;
      for (const step of result.output.trace) {
        const row = rows.findIndex(
          (values) =>
            values[column] ===
            Math.max(...rows.map((candidate) => candidate[column])),
        );
        column = columns[row].indexOf(Math.max(...columns[row]));
        expect([step.rowAction, step.columnAction]).toEqual([row, column]);
        expect(step.isPureEquilibrium).toBe(
          expected.some(([r, c]) => r === row && c === column),
        );
      }
    }
  });
  it("retains a no-pure-equilibrium matching-pennies cycle", () => {
    const draws = [0.9, 0, 0, 0.9, 0, 0.9, 0.9, 0, 0, 0];
    let cursor = 0;
    const { seed, ...base } = example.input;
    const result = tool.execute(
      { ...base, minimumPayoff: -1, maximumPayoff: 1, iterations: 4 },
      { random: () => draws[cursor++] },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        equilibria: [],
        summary: { equilibriumCount: 0, firstRepeatedProfileStep: 3 },
        trace: [
          { rowAction: 0, columnAction: 1, isPureEquilibrium: false },
          { rowAction: 1, columnAction: 0, isPureEquilibrium: false },
          { rowAction: 0, columnAction: 1, isPureEquilibrium: false },
          { rowAction: 1, columnAction: 0, isPureEquilibrium: false },
        ],
      },
    });
  });
  it("keeps all tied equilibria and rejects invalid shapes/ranges/work bounds", () => {
    const tied = tool.execute({
      ...example.input,
      minimumPayoff: 0,
      maximumPayoff: 0,
    });
    expect(tied).toMatchObject({
      ok: true,
      output: {
        rowPayoffs: [
          [0, 0],
          [0, 0],
        ],
        columnPayoffs: [
          [0, 0],
          [0, 0],
        ],
        initial: { rowAction: 1, columnAction: 0 },
        equilibria: [
          { rowStrategy: 0, columnStrategy: 0, rowPayoff: 0, columnPayoff: 0 },
          { rowStrategy: 0, columnStrategy: 1, rowPayoff: 0, columnPayoff: 0 },
          { rowStrategy: 1, columnStrategy: 0, rowPayoff: 0, columnPayoff: 0 },
          { rowStrategy: 1, columnStrategy: 1, rowPayoff: 0, columnPayoff: 0 },
        ],
        summary: { equilibriumCount: 4, firstRepeatedProfileStep: 2 },
        trace: [
          { step: 1, rowAction: 0, columnAction: 0, isPureEquilibrium: true },
          { step: 2, rowAction: 0, columnAction: 0, isPureEquilibrium: true },
          { step: 3, rowAction: 0, columnAction: 0, isPureEquilibrium: true },
        ],
      },
    });
    if (!tied.ok) throw new Error("Expected an all-tied game");
    expect(matchesToolJsonSchema(tied.output, tool.outputSchema)).toBe(true);
    for (const change of [
      { rowStrategies: 0 },
      { columnStrategies: 17 },
      { minimumPayoff: 5 },
      { iterations: 0 },
      { iterations: 129 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
  it("counts the initial profile when locating the first repeated tied response", () => {
    const { seed, ...input } = example.input;
    const result = tool.execute(
      { ...input, minimumPayoff: 0, maximumPayoff: 0, iterations: 1 },
      { random: () => 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        initial: { rowAction: 0, columnAction: 0 },
        trace: [
          { step: 1, rowAction: 0, columnAction: 0, isPureEquilibrium: true },
        ],
        summary: { equilibriumCount: 4, firstRepeatedProfileStep: 1 },
      },
    });
  });
});
