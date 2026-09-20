import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  solvableMazeTestCaseExample as example,
  calculateSolvableMazeTestCase,
} from "./tool.js";

describe("Random Solvable Maze Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateSolvableMazeTestCase(example.input)).toEqual({
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
  it("has a valid planted path and an independently BFS-optimal solver path", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        rows: 10,
        columns: 12,
        start: { x: 11, y: 0 },
        goal: { x: 0, y: 9 },
        wallProbability: 0.6,
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (const path of [
        result.output.plantedPath,
        result.output.solution.path,
      ]) {
        expect(path[0]).toEqual({ x: 11, y: 0 });
        expect(path.at(-1)).toEqual({ x: 0, y: 9 });
        path.forEach((point, i) => {
          expect(result.output.grid[point.y][point.x]).toBe(0);
          if (i)
            expect(
              Math.abs(point.x - path[i - 1].x) +
                Math.abs(point.y - path[i - 1].y),
            ).toBe(1);
        });
      }
      const queue = [{ x: 11, y: 0, distance: 0 }],
        seen = new Set(["11,0"]);
      let distance = -1;
      for (let index = 0; index < queue.length; index += 1) {
        const point = queue[index];
        if (point.x === 0 && point.y === 9) {
          distance = point.distance;
          break;
        }
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const x = point.x + dx,
            y = point.y + dy,
            key = x + "," + y;
          if (
            x >= 0 &&
            y >= 0 &&
            y < 10 &&
            x < 12 &&
            result.output.grid[y][x] === 0 &&
            !seen.has(key)
          ) {
            seen.add(key);
            queue.push({ x, y, distance: point.distance + 1 });
          }
        }
      }
      expect(result.output.solution.cost).toBe(distance);
      expect(JSON.parse(result.output.gridJson)).toEqual(result.output.grid);
    }
  });
  it("supports identical endpoints, one-dimensional grids, and both wall-probability endpoints", () => {
    expect(
      tool.execute({
        rows: 1,
        columns: 1,
        start: { x: 0, y: 0 },
        goal: { x: 0, y: 0 },
        wallProbability: 1,
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        grid: [[0]],
        solution: { cost: 0, explored: 1, path: [{ x: 0, y: 0 }] },
      },
    });
    const result = tool.execute({
      ...example.input,
      rows: 1,
      goal: { x: 3, y: 0 },
      wallProbability: 0,
    });
    expect(result).toMatchObject({
      ok: true,
      output: { grid: [[0, 0, 0, 0]], solution: { cost: 3 } },
    });
  });
  it("rejects endpoints outside dimensions, invalid probabilities, and resource excess", () => {
    for (const change of [
      { rows: 0 },
      { columns: 33 },
      { goal: { x: 4, y: 2 } },
      { start: { x: -1, y: 0 } },
      { wallProbability: -0.1 },
      { wallProbability: 1.1 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
