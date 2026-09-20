import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  terrainProfileExample as example,
  calculateTerrainProfile,
} from "./tool.js";

describe("Random Terrain Profile Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateTerrainProfile(example.input)).toEqual({
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
  it("interpolates each control exactly and keeps flat-tangent samples inside neighboring heights", () => {
    for (let seed = 0; seed < 12; seed += 1) {
      const result = tool.execute({
        ...example.input,
        controlCount: 8,
        subdivisions: 10,
        minimumHeight: -10,
        maximumHeight: 20,
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (let i = 0; i < result.output.controls.length; i += 1)
        expect(result.output.samples[i * 10]).toEqual(
          result.output.controls[i],
        );
      for (let i = 0; i < result.output.controls.length - 1; i += 1)
        for (let j = 0; j < 10; j += 1) {
          const height = result.output.samples[i * 10 + j].y,
            low = Math.min(
              result.output.controls[i].y,
              result.output.controls[i + 1].y,
            ),
            high = Math.max(
              result.output.controls[i].y,
              result.output.controls[i + 1].y,
            );
          expect(height).toBeGreaterThanOrEqual(low - 1e-9);
          expect(height).toBeLessThanOrEqual(high + 1e-9);
        }
    }
  });
  it("supports cardinal tangents and constant profiles without assuming an exact arc length", () => {
    const result = tool.execute({
      ...example.input,
      minimumHeight: -2,
      maximumHeight: -2,
      tangentMode: "cardinal",
    });
    expect(result).toMatchObject({
      ok: true,
      output: { sampledPathLength: 4 },
    });
    if (result.ok)
      expect(result.output.samples.every((point) => point.y === -2)).toBe(true);
    expect(
      tool.execute({ ...example.input, tangentMode: "cardinal" }),
    ).toMatchObject({ ok: true });
  });
  it("rejects reversed heights, resource excess, collapsed grids, and actual length overflow", () => {
    for (const change of [
      { minimumHeight: 5 },
      { controlCount: 65 },
      { subdivisions: 0 },
      { width: 0 },
      { width: Number.MIN_VALUE },
      { maximumHeight: 1.5 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        controlCount: 2,
        width: Number.MAX_VALUE,
        minimumHeight: 0,
        maximumHeight: 0,
      }),
    ).toMatchObject({ ok: true });
  });
});
