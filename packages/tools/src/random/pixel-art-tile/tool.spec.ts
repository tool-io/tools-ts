import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  pixelArtTileExample as example,
  calculatePixelArtTile,
} from "./tool.js";

describe("Random Pixel Art Tile Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculatePixelArtTile(example.input)).toEqual({
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
  it("checks each symmetry by independent coordinate mappings for odd/even tiles", () => {
    for (const size of [3, 4])
      for (const symmetry of [
        "none",
        "left-right",
        "top-bottom",
        "both",
        "quarter-turn",
      ] as const) {
        const result = tool.execute({ ...example.input, size, symmetry });
        if (!result.ok) throw new Error("Expected success");
        const cells = result.output.cells;
        expect(cells).toHaveLength(size);
        expect(new Set(result.output.colors).size).toBe(3);
        cells.forEach((row, y) =>
          row.forEach((value, x) => {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(3);
            if (symmetry === "left-right" || symmetry === "both")
              expect(value).toBe(cells[y][size - 1 - x]);
            if (symmetry === "top-bottom" || symmetry === "both")
              expect(value).toBe(cells[size - 1 - y][x]);
            if (symmetry === "quarter-turn")
              expect(value).toBe(cells[size - 1 - x][y]);
          }),
        );
        expect((result.output.svg.match(/<rect /g) ?? []).length).toBe(
          size * size,
        );
      }
  });
  it("reports exhausted palettes and refuses to reduce the requested color count", () => {
    const { seed, ...input } = example.input;
    expect(
      tool.execute({ ...input, maximumAttempts: 4 }, { random: () => 0 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "maximumAttempts", code: "palette_search_exhausted" },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, maximumAttempts: 2 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "maximumAttempts", code: "insufficient_attempt_budget" },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, symmetry: "diagonal" }),
    ).toMatchObject({ ok: false, error: { issues: [{ field: "symmetry" }] } });
  });
});
