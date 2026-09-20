import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  feedforwardNetworkTestCaseExample as example,
  calculateFeedforwardNetworkTestCase,
} from "./tool.js";

describe("Random Feedforward Network Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateFeedforwardNetworkTestCase(example.input)).toEqual({
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
  it("composes each declared layer with independent dot products and activation evaluation", () => {
    const result = tool.execute({
      ...example.input,
      layerSizes: [3, 4, 2, 2],
      activations: ["tanh", "sigmoid", "linear"],
      valueDivisor: 2,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    let previous: readonly number[] = result.output.inputs;
    const round = (value: number) => Number(value.toPrecision(10));
    for (const layer of result.output.layers) {
      const pre = layer.weights.map((row, neuron) =>
        row.reduce(
          (sum, weight, i) => sum + weight * previous[i],
          layer.biases[neuron],
        ),
      );
      const activate = (value: number) =>
        layer.activation === "tanh"
          ? Math.tanh(value)
          : layer.activation === "sigmoid"
            ? 1 / (1 + Math.exp(-value))
            : layer.activation === "relu"
              ? Math.max(0, value)
              : value;
      expect(layer.preActivation).toEqual(pre.map(round));
      expect(layer.output).toEqual(pre.map(activate).map(round));
      previous = layer.output;
    }
    expect(result.output.output).toEqual(previous);
  });
  it("supports single-neuron zero networks and the largest supported shape", () => {
    expect(
      tool.execute({
        ...example.input,
        minimumValue: 0,
        maximumValue: 0,
        layerSizes: [1, 1],
        activations: ["sigmoid"],
      }),
    ).toMatchObject({ ok: true, output: { inputs: [0], output: [0.5] } });
    const result = tool.execute({
      ...example.input,
      layerSizes: Array(9).fill(16),
      activations: Array(8).fill("tanh"),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.layers).toHaveLength(8);
      expect(result.output.output).toHaveLength(16);
    }
  });
  it("rejects incompatible activations/shapes, invalid ranges, and actual numeric overflow", () => {
    for (const change of [
      { activations: ["relu"] },
      { layerSizes: [3, 0, 1] },
      { layerSizes: [3] },
      { activations: ["gelu", "linear"] },
      { minimumValue: 4 },
      { valueDivisor: 0 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        minimumValue: 1,
        maximumValue: 1,
        valueDivisor: 1e-200,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        minimumValue: 1,
        maximumValue: 1,
        valueDivisor: Number.MIN_VALUE,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});
