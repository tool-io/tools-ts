import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly promptLengths: readonly number[];
  readonly generatedLengths: readonly number[];
};
export type Output = {
  readonly liveTokens: number;
  readonly paddedTokens: number;
  readonly wastedTokens: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    promptLengths: { type: "array", maxItems: 256, items: { type: "integer" } },
    generatedLengths: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["promptLengths", "generatedLengths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    liveTokens: { type: "integer" },
    paddedTokens: { type: "integer" },
    wastedTokens: { type: "integer" },
  },
  required: ["liveTokens", "paddedTokens", "wastedTokens"],
} as const;
/** Static rectangular padding by the maximum final sequence length; excludes continuous-batching reuse. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { promptLengths, generatedLengths } = request;
  const compute = (): Output => {
    H.sameLength(promptLengths, generatedLengths);
    H.domain(
      promptLengths.length > 0 &&
        promptLengths.every((x) => x >= 0) &&
        generatedLengths.every((x) => x >= 0),
    );
    return {
      liveTokens: promptLengths.reduce(
        (s, x, i) => s + x + generatedLengths[i],
        0,
      ),
      paddedTokens:
        promptLengths.length *
        Math.max(...promptLengths.map((x, i) => x + generatedLengths[i])),
      wastedTokens:
        promptLengths.length *
          Math.max(...promptLengths.map((x, i) => x + generatedLengths[i])) -
        promptLengths.reduce((s, x, i) => s + x + generatedLengths[i], 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { promptLengths: [3, 5], generatedLengths: [2, 3] },
  output: { liveTokens: 13, paddedTokens: 16, wastedTokens: 3 },
} satisfies ToolExample<Input, Output>;
export const inferenceBatchSequenceWasteTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/inference-batch-sequence-waste-term",
    title: "Inference Batch Sequence Waste Term Tool",
    description:
      "Static rectangular padding by the maximum final sequence length; excludes continuous-batching reuse.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        promptLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        generatedLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["promptLengths", "generatedLengths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        liveTokens: { type: "integer" },
        paddedTokens: { type: "integer" },
        wastedTokens: { type: "integer" },
      },
      required: ["liveTokens", "paddedTokens", "wastedTokens"],
    },
    ports: {
      inputs: [
        {
          id: "promptLengths",
          label: "Prompt Lengths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "generatedLengths",
          label: "Generated Lengths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "liveTokens",
          label: "Live Tokens",
          valueType: { type: "integer" },
        },
        {
          id: "paddedTokens",
          label: "Padded Tokens",
          valueType: { type: "integer" },
        },
        {
          id: "wastedTokens",
          label: "Wasted Tokens",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = inferenceBatchSequenceWasteTermTool.execute;
export default inferenceBatchSequenceWasteTermTool;
