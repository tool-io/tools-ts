import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  rankSumTestCaseExample as example,
  calculateRankSumTestCase,
} from "./tool.js";

describe("Random Rank-Sum Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateRankSumTestCase(example.input)).toEqual({
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
  it("matches independent pairwise win/tie counting across tied and separated lattices", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        first: { count: 12, minimum: -3, maximum: 8, step: 2 },
        second: { count: 9, minimum: 0, maximum: 12, step: 3 },
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      let wins = 0,
        ties = 0;
      for (const a of result.output.first)
        for (const b of result.output.second) {
          if (a > b) wins += 1;
          if (a === b) ties += 1;
        }
      expect(result.output.analysis.firstU).toBe(wins + ties / 2);
      expect(result.output.analysis.secondU).toBe(108 - wins - ties / 2);
      expect(result.output.crossSampleTiePairs).toBe(ties);
      expect(
        result.output.first.every(
          (value) => value >= -3 && value <= 8 && (value + 3) % 2 === 0,
        ),
      ).toBe(true);
      expect(
        result.output.second.every(
          (value) => value >= 0 && value <= 12 && value % 3 === 0,
        ),
      ).toBe(true);
    }
  });
  it("handles all ties and guaranteed order separation without special inference claims", () => {
    const constant = { count: 3, minimum: 4, maximum: 4, step: 1 };
    expect(
      tool.execute({ first: constant, second: constant, seed: 42 }),
    ).toMatchObject({
      ok: true,
      output: {
        crossSampleTiePairs: 9,
        analysis: { firstU: 4.5, secondU: 4.5, statistic: 4.5 },
      },
    });
    expect(
      tool.execute({
        first: { ...constant, minimum: 0, maximum: 1 },
        second: { ...constant, minimum: 3, maximum: 4 },
        seed: 42,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        crossSampleTiePairs: 0,
        analysis: { firstU: 0, secondU: 9, statistic: 0 },
      },
    });
  });
  it("rejects invalid lattices/resources and handles exact safe-integer endpoint arithmetic", () => {
    for (const first of [
      { ...example.input.first, step: 0 },
      { ...example.input.first, minimum: 4 },
      { ...example.input.first, count: 513 },
      {
        ...example.input.first,
        minimum: -Number.MAX_SAFE_INTEGER,
        maximum: Number.MAX_SAFE_INTEGER,
      },
    ])
      expect(tool.execute({ ...example.input, first })).toMatchObject({
        ok: false,
      });
    const result = tool.execute({
      ...example.input,
      first: {
        count: 4,
        minimum: Number.MAX_SAFE_INTEGER - 4,
        maximum: Number.MAX_SAFE_INTEGER,
        step: 2,
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.first.every(Number.isSafeInteger)).toBe(true);
  });
});
