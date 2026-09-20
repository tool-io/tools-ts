import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  cssKeyframeMotionExample as example,
  calculateCssKeyframeMotion,
} from "./tool.js";

describe("Random CSS Keyframe Motion Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCssKeyframeMotion(example.input)).toEqual({
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
  it("has strictly increasing endpoint-complete keyframes and bounded interpolation samples", () => {
    for (let seed = 0; seed < 12; seed += 1) {
      const result = tool.execute({
        ...example.input,
        waypointCount: 16,
        sampleCount: 100,
        minimumX: -20,
        maximumX: 30,
        minimumY: -10,
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.output.keyframes[0].time).toBe(0);
      expect(result.output.keyframes.at(-1)?.time).toBe(1);
      for (let i = 1; i < result.output.keyframes.length; i += 1)
        expect(result.output.keyframes[i].time).toBeGreaterThan(
          result.output.keyframes[i - 1].time,
        );
      for (const point of result.output.samples) {
        expect(point.x).toBeGreaterThanOrEqual(-20);
        expect(point.x).toBeLessThanOrEqual(30);
        expect(point.y).toBeGreaterThanOrEqual(-10);
        expect(point.y).toBeLessThanOrEqual(10);
      }
      expect(result.output.samples[0]).toEqual(result.output.keyframes[0]);
      expect(result.output.samples.at(-1)).toEqual(
        result.output.keyframes.at(-1),
      );
      expect(result.output.css).toContain("prefers-reduced-motion");
    }
  });
  it("supports a stationary path and rejects invalid time, count, and range choices", () => {
    expect(
      tool.execute({
        ...example.input,
        minimumX: 4,
        maximumX: 4,
        minimumY: -2,
        maximumY: -2,
      }),
    ).toMatchObject({ ok: true, output: { pathLengthPixels: 0 } });
    for (const change of [
      { durationSeconds: 0 },
      { durationSeconds: Infinity },
      { waypointCount: 1 },
      { sampleCount: 1025 },
      { minimumX: 11 },
      { maximumY: -1 },
      { maximumX: 1.5 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
