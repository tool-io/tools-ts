import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  drumPatternExample as example,
  calculateDrumPattern,
} from "./tool.js";

describe("Random Quantized Drum Pattern Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateDrumPattern(example.input)).toEqual({
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
  it("has exact known pulse and timing positions, including an explicit rest lane", () => {
    const result = tool.execute({
      ...example.input,
      lanes: [
        { id: "hit", midiNote: 40, hitProbability: 1 },
        { id: "rest", midiNote: 41, hitProbability: 0 },
      ],
      minimumVelocity: 64,
      maximumVelocity: 64,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.velocityGrid).toEqual([
      Array(8).fill(64),
      Array(8).fill(0),
    ]);
    expect(result.output.hits.map((hit) => hit.tick)).toEqual([
      0, 12, 24, 36, 48, 60, 72, 84,
    ]);
    expect(result.output.hits.map((hit) => hit.onsetSeconds)).toEqual([
      0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75,
    ]);
    expect(result.output.durationSeconds).toBe(2);
    expect(result.output.totalTicks).toBe(96);
  });
  it("keeps velocities, lane identities and grid-hit membership consistent", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected success");
    const out = result.output;
    expect(out.hits).toHaveLength(
      out.velocityGrid.flat().filter((v) => v > 0).length,
    );
    for (const hit of out.hits) {
      const lane = out.lanes.findIndex((lane) => lane.id === hit.laneId);
      expect(out.velocityGrid[lane][hit.step]).toBe(hit.velocity);
      expect(hit.velocity).toBeGreaterThanOrEqual(60);
      expect(hit.velocity).toBeLessThanOrEqual(100);
      expect(hit.tick).toBeLessThan(out.totalTicks);
      expect(hit.onsetSeconds).toBeLessThan(out.durationSeconds);
    }
  });
  it("rejects incompatible grids, excessive work and unsafe timing", () => {
    expect(
      tool.execute({ ...example.input, pulsesPerQuarter: 25 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "pulsesPerQuarter", code: "nonintegral_pulse_grid" }],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        meterNumerator: 1,
        meterDenominator: 16,
        subdivisionsPerQuarter: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "subdivisionsPerQuarter", code: "nonintegral_bar_grid" },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        bars: 2,
        meterNumerator: 1,
        meterDenominator: 16,
        subdivisionsPerQuarter: 2,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "subdivisionsPerQuarter", code: "nonintegral_bar_grid" },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        bars: 16,
        meterNumerator: 16,
        meterDenominator: 1,
        subdivisionsPerQuarter: 24,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "lanes", code: "resource_limit" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        pulsesPerQuarter: Number.MAX_SAFE_INTEGER - 1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "pulsesPerQuarter", code: "unsafe_tick_total" }],
      },
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
