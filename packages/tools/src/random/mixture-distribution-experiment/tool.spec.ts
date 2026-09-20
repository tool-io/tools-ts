import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  mixtureDistributionExperimentExample as example,
  calculateMixtureDistributionExperiment,
} from "./tool.js";

describe("Random Mixture Distribution Experiment Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMixtureDistributionExperiment(example.input)).toEqual({
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
  it("retains component identities, exact counts, and separate parameters after shuffling", () => {
    const result = tool.execute({ ...example.input, count: 200 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.observations).toHaveLength(200);
    expect(
      result.output.components.reduce(
        (sum, component) => sum + component.sampleCount,
        0,
      ),
    ).toBe(200);
    for (const component of result.output.components) {
      const observations = result.output.observations.filter(
        (observation) => observation.componentIndex === component.index,
      );
      expect(observations).toHaveLength(component.sampleCount);
      expect(component.parameters).toEqual(
        example.input.components[component.index],
      );
      if (component.parameters.kind === "exponential")
        expect(
          observations.every((observation) => observation.value >= 0),
        ).toBe(true);
    }
  });
  it("never samples zero-weight components and normalizes extreme finite weights", () => {
    const result = tool.execute({
      count: 12,
      seed: 42,
      components: [
        { kind: "normal", weight: 0, mean: 0, standardDeviation: 1 },
        {
          kind: "normal",
          weight: Number.MAX_VALUE,
          mean: 7,
          standardDeviation: 0,
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.observations).toEqual(
      Array.from({ length: 12 }, () => ({ componentIndex: 1, value: 7 })),
    );
    expect(
      result.output.components.map((component) => component.probability),
    ).toEqual([0, 1]);
  });
  it("rejects zero total weight, unsupported component fields, excessive counts, and real sampler overflow", () => {
    for (const components of [
      [{ kind: "normal", weight: 0, mean: 0, standardDeviation: 1 }],
      [{ kind: "exponential", weight: 1, rate: 0 }],
      [{ kind: "normal", weight: 1, mean: 0, standardDeviation: -1 }],
      [{ kind: "normal", weight: 1, mean: 0, standardDeviation: 1, rate: 1 }],
      [{ kind: "uniform", weight: 1, minimum: 0, maximum: 1 }],
    ])
      expect(tool.execute({ ...example.input, components })).toMatchObject({
        ok: false,
      });
    expect(tool.execute({ ...example.input, count: 2049 })).toMatchObject({
      ok: false,
    });
    expect(
      tool.execute({
        count: 2,
        seed: 42,
        components: [
          { kind: "exponential", weight: 1, rate: Number.MIN_VALUE },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "sampler_failed" }] },
    });
  });
});
