import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  abTestExperimentExample as example,
  calculateAbTestExperiment,
} from "./tool.js";

describe("Random A/B Test Experiment Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateAbTestExperiment(example.input)).toEqual({
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
  it("retains generating rates separately from realized rates and verifies count support", () => {
    const result = tool.execute({
      ...example.input,
      experimentCount: 20,
      visitorsA: 100,
      visitorsB: 80,
      probabilityA: 0.2,
      probabilityB: 0.4,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.model.probabilityA).toBe(0.2);
    expect(result.output.experiments).toHaveLength(20);
    for (const experiment of result.output.experiments) {
      expect(experiment.conversionsA).toBeGreaterThanOrEqual(0);
      expect(experiment.conversionsA).toBeLessThanOrEqual(100);
      expect(experiment.conversionsB).toBeGreaterThanOrEqual(0);
      expect(experiment.conversionsB).toBeLessThanOrEqual(80);
      expect(experiment.analysis.rateA).toBeCloseTo(
        experiment.conversionsA / 100,
        11,
      );
      expect(experiment.analysis.rateB).toBeCloseTo(
        experiment.conversionsB / 80,
        11,
      );
      expect(experiment.analysis.difference).toBeCloseTo(
        experiment.conversionsB / 80 - experiment.conversionsA / 100,
        11,
      );
      expect(experiment.analysis.pValue).toBeGreaterThanOrEqual(0);
      expect(experiment.analysis.pValue).toBeLessThanOrEqual(1);
    }
  });
  it("preserves explicit degenerate all-failure/all-success core conventions", () => {
    for (const probability of [0, 1]) {
      const result = tool.execute({
        ...example.input,
        probabilityA: probability,
        probabilityB: probability,
      });
      expect(result.ok).toBe(true);
      if (result.ok)
        for (const experiment of result.output.experiments)
          expect(experiment.analysis).toMatchObject({
            difference: 0,
            standardError: 0,
            zScore: 0,
            pValue: 1,
            significant: false,
          });
    }
  });
  it("rejects excessive work, invalid probability/counts, and unusable confidence levels", () => {
    for (const change of [
      { experimentCount: 128, visitorsA: 10000, visitorsB: 10000 },
      { visitorsA: 0 },
      { probabilityA: -0.1 },
      { probabilityB: 1.1 },
      { experimentCount: 129 },
      { confidenceLevel: 1 },
      { confidenceLevel: Number.MIN_VALUE },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
