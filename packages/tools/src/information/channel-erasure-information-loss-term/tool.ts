import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly erasureProbability: number;
  readonly inputEntropyBits: number;
};
export type Output = {
  readonly lostBits: number;
  readonly retainedBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    erasureProbability: { type: "number", minimum: 0, maximum: 1 },
    inputEntropyBits: { type: "number", minimum: 0 },
  },
  required: ["erasureProbability", "inputEntropyBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostBits: { type: "number" },
    retainedBits: { type: "number" },
  },
  required: ["lostBits", "retainedBits"],
} as const;
/** Compute expected information loss for independent erasure of a symbol with supplied entropy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { erasureProbability, inputEntropyBits } = request;
  const compute = (): Output => {
    H.probability(erasureProbability);
    H.domain(inputEntropyBits >= 0);
    const lostBits = erasureProbability * inputEntropyBits;
    return { lostBits, retainedBits: inputEntropyBits - lostBits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { erasureProbability: 0.25, inputEntropyBits: 2 },
  output: { lostBits: 0.5, retainedBits: 1.5 },
} satisfies ToolExample<Input, Output>;
export const channelErasureInformationLossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/channel-erasure-information-loss-term",
    title: "Channel Erasure Information Loss Term Tool",
    description:
      "Compute expected information loss for independent erasure of a symbol with supplied entropy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        erasureProbability: { type: "number", minimum: 0, maximum: 1 },
        inputEntropyBits: { type: "number", minimum: 0 },
      },
      required: ["erasureProbability", "inputEntropyBits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lostBits: { type: "number" },
        retainedBits: { type: "number" },
      },
      required: ["lostBits", "retainedBits"],
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
          id: "inputEntropyBits",
          label: "Input Entropy Bits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lostBits", label: "Lost Bits", valueType: { type: "number" } },
        {
          id: "retainedBits",
          label: "Retained Bits",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = channelErasureInformationLossTermTool.execute;
export default channelErasureInformationLossTermTool;
