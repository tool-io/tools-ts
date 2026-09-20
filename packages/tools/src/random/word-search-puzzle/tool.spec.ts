import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  wordSearchPuzzleExample as example,
  calculateWordSearchPuzzle,
} from "./tool.js";

describe("Random Word Search Puzzle Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateWordSearchPuzzle(example.input)).toEqual({
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
  it("retains every planted answer and uses only selected directions", () => {
    const steps = {
      E: [0, 1],
      W: [0, -1],
      N: [-1, 0],
      S: [1, 0],
      NE: [-1, 1],
      NW: [-1, -1],
      SE: [1, 1],
      SW: [1, -1],
    } as const;
    for (let seed = 0; seed < 12; seed += 1) {
      const result = tool.execute({
        words: ["alpha", "beta", "gamma"],
        rows: 8,
        columns: 8,
        directions: ["E", "SW", "N"],
        maximumAttempts: 10000,
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (const placement of result.output.placements) {
        expect(["E", "SW", "N"]).toContain(placement.direction);
        const [dr, dc] = steps[placement.direction];
        for (let i = 0; i < placement.word.length; i += 1) {
          expect(
            result.output.grid[placement.row + dr * i][
              placement.column + dc * i
            ],
          ).toBe(placement.word[i]);
          expect(
            result.output.answerGrid[placement.row + dr * i][
              placement.column + dc * i
            ],
          ).toBe(placement.word[i]);
        }
      }
    }
  });
  it("supports compatible crossings and distinguishes impossible placements from search exhaustion", () => {
    expect(
      tool.execute({
        words: ["AB", "BC"],
        rows: 1,
        columns: 3,
        directions: ["E"],
        maximumAttempts: 100,
        seed: 42,
      }),
    ).toMatchObject({ ok: true, output: { grid: [["A", "B", "C"]] } });
    expect(
      tool.execute({ ...example.input, words: ["AB", "CD"], rows: 1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "no_feasible_placement" }] },
    });
    expect(
      tool.execute({ ...example.input, maximumAttempts: 1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "placement_search_exhausted" }] },
    });
  });
  it("rejects case-folded duplicates, unsupported characters, impossible lengths, and resource excess", () => {
    for (const change of [
      { words: ["a", "A"] },
      { words: ["café"] },
      { words: ["AB\n"] },
      { words: ["LONG"] },
      { directions: ["E", "E"] },
      { rows: 0 },
      {
        words: Array.from(
          { length: 16 },
          (_, i) => "A".repeat(18) + String.fromCharCode(65 + i),
        ),
        rows: 32,
        columns: 32,
        directions: ["E", "W", "N", "S", "NE", "NW", "SE", "SW"],
      },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
