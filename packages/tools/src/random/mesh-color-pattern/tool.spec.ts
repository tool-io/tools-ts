import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  meshColorPatternExample as example,
  calculateMeshColorPattern,
} from "./tool.js";

describe("Random Mesh Color Pattern Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMeshColorPattern(example.input)).toEqual({
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
  it("has an independently known black/white rectangular blend", () => {
    const draws = [0, 0xffffff / 0x1000000, 0, 0xffffff / 0x1000000];
    let i = 0;
    const result = tool.execute(
      { controlRows: 2, controlColumns: 2, samplesPerCell: 2 },
      { random: () => draws[i++] },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.colors).toEqual(
      Array.from({ length: 3 }, () => ["#000000", "#808080", "#FFFFFF"]),
    );
  });
  it("retains every control node at a single shared-edge grid location", () => {
    const result = tool.execute({
      controlRows: 3,
      controlColumns: 4,
      samplesPerCell: 3,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.colors).toHaveLength(7);
    expect(result.output.colors[0]).toHaveLength(10);
    result.output.controlColors.forEach((row, y) =>
      row.forEach((color, x) =>
        expect(result.output.colors[y * 3][x * 3]).toBe(color),
      ),
    );
    expect(tool.execute({ ...example.input, samplesPerCell: 9 })).toMatchObject(
      { ok: false, error: { issues: [{ field: "samplesPerCell" }] } },
    );
  });
});
