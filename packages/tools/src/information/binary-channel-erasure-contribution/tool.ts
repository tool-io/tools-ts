import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly erasureProbability: number;
  readonly inputOneProbability: number;
};
export type Output = {
  readonly conditionalEntropyBits: number;
  readonly retainedEntropyBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    erasureProbability: { type: "number", minimum: 0, maximum: 1 },
    inputOneProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["erasureProbability", "inputOneProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionalEntropyBits: { type: "number" },
    retainedEntropyBits: { type: "number" },
  },
  required: ["conditionalEntropyBits", "retainedEntropyBits"],
} as const;
/** Compute binary input entropy erased and retained by an independent binary erasure channel. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { erasureProbability, inputOneProbability } = request;
  const compute = (): Output => {
    H.probability(erasureProbability);
    H.probability(inputOneProbability);
    return {
      conditionalEntropyBits:
        erasureProbability *
        (inputOneProbability === 0 || inputOneProbability === 1
          ? 0
          : -inputOneProbability * Math.log2(inputOneProbability) -
            (1 - inputOneProbability) * Math.log2(1 - inputOneProbability)),
      retainedEntropyBits:
        (1 - erasureProbability) *
        (inputOneProbability === 0 || inputOneProbability === 1
          ? 0
          : -inputOneProbability * Math.log2(inputOneProbability) -
            (1 - inputOneProbability) * Math.log2(1 - inputOneProbability)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { erasureProbability: 0.25, inputOneProbability: 0.5 },
  output: { conditionalEntropyBits: 0.25, retainedEntropyBits: 0.75 },
} satisfies ToolExample<Input, Output>;
export const binaryChannelErasureContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/binary-channel-erasure-contribution",
    title: "Binary Channel Erasure Contribution Tool",
    description:
      "Compute binary input entropy erased and retained by an independent binary erasure channel.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        erasureProbability: { type: "number", minimum: 0, maximum: 1 },
        inputOneProbability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["erasureProbability", "inputOneProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionalEntropyBits: { type: "number" },
        retainedEntropyBits: { type: "number" },
      },
      required: ["conditionalEntropyBits", "retainedEntropyBits"],
    },
    ports: {
      inputs: [
        {
          id: "erasureProbability",
          label: "Erasure Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputOneProbability",
          label: "Input One Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conditionalEntropyBits",
          label: "Conditional Entropy Bits",
          valueType: { type: "number" },
        },
        {
          id: "retainedEntropyBits",
          label: "Retained Entropy Bits",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = binaryChannelErasureContributionTool.execute;
export default binaryChannelErasureContributionTool;
