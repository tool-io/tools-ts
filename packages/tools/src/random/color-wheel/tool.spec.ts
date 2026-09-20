import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  colorWheelExample as example,
  calculateColorWheel,
} from "./tool.js";

describe("Random Color Wheel Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateColorWheel(example.input)).toEqual({
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
  it("has independently known primary hues and exact circular coverage", () => {
    const result = tool.execute(
      {
        sectorCount: 3,
        saturationPercent: 100,
        lightnessPercent: 50,
        innerRadiusFraction: 0,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.wedges.map((w) => w.color)).toEqual([
      "#FF0000",
      "#00FF00",
      "#0000FF",
    ]);
    expect(
      result.output.wedges.map((w) => [w.startAngleDegrees, w.endAngleDegrees]),
    ).toEqual([
      [0, 120],
      [120, 240],
      [240, 360],
    ]);
    expect(result.output.wedges.every((w) => w.path.endsWith(" L 0 0 Z"))).toBe(
      true,
    );
    expect((result.output.svg.match(/<path /g) ?? []).length).toBe(3);
  });
  it("supports grayscale and annuli while rejecting invalid ring geometry", () => {
    const result = tool.execute({ ...example.input, saturationPercent: 0 });
    if (!result.ok) throw new Error("Expected success");
    expect(new Set(result.output.wedges.map((w) => w.color)).size).toBe(1);
    expect(
      result.output.wedges.every((w) => w.path.includes("A 0.6 0.6")),
    ).toBe(true);
    expect(result.output.svg).not.toMatch(/NaN|Infinity|undefined|script|href/);
    expect(
      tool.execute({ ...example.input, innerRadiusFraction: 1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "innerRadiusFraction" }] },
    });
  });
});
