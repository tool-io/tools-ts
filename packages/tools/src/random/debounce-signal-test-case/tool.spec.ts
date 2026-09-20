import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  debounceSignalTestCaseExample as example,
  calculateDebounceSignalTestCase,
} from "./tool.js";

describe("Random Debounce Signal Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateDebounceSignalTestCase(example.input)).toEqual({
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
  it("matches an independent all-equal suffix-window debounce oracle", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...example.input,
        transitionCount: 10,
        maximumBounceSamples: 10,
        stableHoldSamples: 5,
        requiredSamples: 3,
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      let state = false;
      const expected = result.output.raw.map((_, index) => {
        const window = result.output.raw.slice(
          Math.max(0, index - 2),
          index + 1,
        );
        if (window.length === 3 && window.every((value) => value === window[0]))
          state = window[0];
        return state;
      });
      expect(result.output.filtered).toEqual(expected);
      expect(result.output.mismatchCounts.rawVersusClean).toBe(
        result.output.raw.filter((value, i) => value !== result.output.clean[i])
          .length,
      );
      expect(result.output.mismatchCounts.filteredVersusClean).toBe(
        result.output.filtered.filter(
          (value, i) => value !== result.output.clean[i],
        ).length,
      );
      expect(result.output.timesMilliseconds).toEqual(
        result.output.raw.map((_, i) => i * 10),
      );
    }
  });
  it("retains expected no-bounce detection delay and legitimate missed-transition cases", () => {
    const result = tool.execute({ ...example.input, maximumBounceSamples: 0 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.raw).toEqual(result.output.clean);
      expect(
        result.output.detectedTransitions.map((edge) => edge.index),
      ).toEqual(
        result.output.intendedTransitions.map((edge) => edge.startIndex + 1),
      );
    }
    expect(
      tool.execute({ ...example.input, requiredSamples: 100000 }),
    ).toMatchObject({ ok: true, output: { detectedTransitions: [] } });
    const immediate = tool.execute({ ...example.input, requiredSamples: 1 });
    expect(immediate.ok).toBe(true);
    if (immediate.ok)
      expect(immediate.output.filtered).toEqual(immediate.output.raw);
  });
  it("rejects unsupported timing/counts/work and actual timestamp overflow", () => {
    for (const change of [
      { samplePeriodMilliseconds: 0 },
      { requiredSamples: 0 },
      { oldStateProbability: 1.1 },
      { transitionCount: 33 },
      { transitionCount: 32, stableHoldSamples: 128, maximumBounceSamples: 32 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        samplePeriodMilliseconds: Number.MAX_VALUE,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});
