import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  rhythmMeasureExample as example,
  calculateRhythmMeasure,
} from "./tool.js";

describe("Random Exact-Fill Rhythm Measure Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateRhythmMeasure(example.input)).toEqual({
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
  it("fills a quarter-note beat with exactly three eighth-note triplets", () => {
    const result = tool.execute({
      meterNumerator: 1,
      meterDenominator: 4,
      beatsPerMinute: 120,
      noteValues: [
        { denominator: 8, dots: 0, tupletActualNotes: 3, tupletNormalNotes: 2 },
      ],
      restProbability: 0,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.divisionsPerQuarter).toBe(3);
    expect(result.output.totalTicks).toBe(3);
    expect(result.output.events).toHaveLength(3);
    expect(result.output.events.map((event) => event.startTick)).toEqual([
      0, 1, 2,
    ]);
    for (const event of result.output.events) {
      expect(event.durationTicks).toBe(1);
      expect(event.durationSeconds).toBe(1 / 6);
      expect(event.isRest).toBe(false);
    }
    expect(result.output.durationSeconds).toBe(0.5);
  });
  it("conserves exact duration under random choices and supports all-rest measures", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...example.input,
        seed,
        restProbability: 1,
      });
      if (!result.ok) throw new Error("Expected success");
      let tick = 0;
      for (const event of result.output.events) {
        expect(event.startTick).toBe(tick);
        tick += event.durationTicks;
        expect(event.isRest).toBe(true);
      }
      expect(tick).toBe(result.output.totalTicks);
      expect(tick / result.output.divisionsPerQuarter).toBe(3);
    }
  });
  it("rejects unfillable or excessive grids and nonrepresentable timing", () => {
    expect(
      tool.execute({
        ...example.input,
        meterNumerator: 1,
        noteValues: [
          {
            denominator: 4,
            dots: 1,
            tupletActualNotes: 1,
            tupletNormalNotes: 1,
          },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "noteValues", code: "unfillable_measure" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        meterNumerator: 16,
        meterDenominator: 1,
        noteValues: [
          {
            denominator: 64,
            dots: 0,
            tupletActualNotes: 13,
            tupletNormalNotes: 1,
          },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "noteValues", code: "resource_limit" }] },
    });
    expect(
      tool.execute({ ...example.input, beatsPerMinute: Number.MIN_VALUE }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "beatsPerMinute", code: "numeric_overflow" }],
      },
    });
  });
});
