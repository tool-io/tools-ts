import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  geometricColorPatternExample as example,
  calculateGeometricColorPattern,
} from "./tool.js";

describe("Random Geometric Color Pattern Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateGeometricColorPattern(example.input)).toEqual({
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
  it("keeps every polygon inside its own cell with independently known area", () => {
    const result = tool.execute({
      columns: 8,
      rows: 7,
      colorCount: 5,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.shapes).toHaveLength(56);
    result.output.shapes.forEach((shape, i) => {
      for (const [x, y] of shape.points) {
        expect(x).toBeGreaterThanOrEqual(i % 8);
        expect(x).toBeLessThanOrEqual((i % 8) + 1);
        expect(y).toBeGreaterThanOrEqual(Math.floor(i / 8));
        expect(y).toBeLessThanOrEqual(Math.floor(i / 8) + 1);
      }
      let doubleArea = 0;
      shape.points.forEach(([x, y], j) => {
        const [nextX, nextY] = shape.points[(j + 1) % shape.points.length];
        doubleArea += x * nextY - nextX * y;
      });
      expect(Math.abs(doubleArea) / 2).toBe(shape.kind === "square" ? 1 : 0.5);
      expect(shape.colorIndex).toBeLessThan(5);
    });
    expect((result.output.svg.match(/<polygon /g) ?? []).length).toBe(56);
    expect(result.output.svg).not.toMatch(/NaN|Infinity|undefined|script|href/);
  });
  it("supports a full single-cell square and rejects excessive dimensions", () => {
    const result = tool.execute(
      { columns: 1, rows: 1, colorCount: 2 },
      { random: () => 0.99 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.shapes[0].kind).toBe("square");
    expect(result.output.shapes[0].points).toHaveLength(4);
    expect(tool.execute({ ...example.input, rows: 17 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "rows" }] },
    });
  });
});
