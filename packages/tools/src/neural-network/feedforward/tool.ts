import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Activation = "linear" | "relu" | "sigmoid" | "tanh";
export type FeedforwardResult = {
  readonly activation: Activation;
  readonly output: readonly number[];
  readonly preActivation: readonly number[];
};
const activations: Record<Activation, (value: number) => number> = {
  linear: (value) => value,
  relu: (value) => Math.max(0, value),
  sigmoid: (value) => 1 / (1 + Math.exp(-value)),
  tanh: Math.tanh,
};
export const demonstrateFeedforwardNetwork = (
  inputs: readonly number[],
  weights: readonly (readonly number[])[],
  biases: readonly number[],
  activation: Activation,
): FeedforwardResult | null => {
  if (
    weights.length !== biases.length ||
    weights.some((row) => row.length !== inputs.length)
  )
    return null;
  const preActivation = weights.map((row, neuron) =>
    row.reduce(
      (sum, weight, index) => sum + weight * (inputs[index] ?? 0),
      biases[neuron] ?? 0,
    ),
  );
  return {
    activation,
    output: preActivation
      .map(activations[activation])
      .map((value) => Number(value.toPrecision(10))),
    preActivation: preActivation.map((value) => Number(value.toPrecision(10))),
  };
};

export const feedforwardExample = {
  input: {
    activation: "relu",
    biases: [0.1, -0.2],
    inputs: [1, 2],
    weights: [
      [0.5, 1],
      [-1, 0.25],
    ],
  },
  output: {
    result: {
      activation: "relu",
      output: [2.6, 0],
      preActivation: [2.6, -0.7],
    },
  },
} satisfies ToolExample<
  {
    readonly activation: Activation;
    readonly biases: readonly number[];
    readonly inputs: readonly number[];
    readonly weights: readonly (readonly number[])[];
  },
  { readonly result: FeedforwardResult }
>;

export const feedforwardTool = createSimpleTool({
  id: "neural-network/feedforward",
  title: "Feedforward Neural Network Demonstrator",
  description:
    "Run one dense neural-network layer with a selectable activation.",
  inputs: [
    {
      format: "vector/features",
      id: "inputs",
      kind: "numberList",
      label: "Input vector",
    },
    {
      format: "matrix/weights",
      id: "weights",
      kind: "matrix",
      label: "Weight matrix",
    },
    {
      format: "vector/biases",
      id: "biases",
      kind: "numberList",
      label: "Bias vector",
    },
    {
      enum: ["relu", "sigmoid", "tanh", "linear"],
      id: "activation",
      kind: "string",
      label: "Activation",
    },
  ],
  outputs: [
    {
      format: "neural-network/layer-output",
      id: "result",
      kind: "object",
      label: "Layer output",
    },
  ],
  calculate: (input) => {
    const result = demonstrateFeedforwardNetwork(
      input.inputs as number[],
      input.weights as number[][],
      input.biases as number[],
      input.activation as Activation,
    );
    if (!result)
      return simpleError(
        "weights",
        "Weight rows and biases must match, and every row must match the input length.",
      );
    return { result };
  },
});
export const runFeedforward = feedforwardTool.execute;
export default feedforwardTool;
