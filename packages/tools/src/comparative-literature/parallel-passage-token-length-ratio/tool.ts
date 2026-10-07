import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTokenCount: number;
  readonly targetTokenCount: number;
};
export type Output = {
  readonly targetToSourceRatio: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTokenCount: { type: "integer", minimum: 1 },
    targetTokenCount: { type: "integer", minimum: 0 },
  },
  required: ["sourceTokenCount", "targetTokenCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetToSourceRatio: { type: "number" },
    difference: { type: "integer" },
  },
  required: ["targetToSourceRatio", "difference"],
} as const;
/** Compare explicitly tokenized parallel-passage lengths without selecting a tokenizer or judging translation fidelity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTokenCount, targetTokenCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sourceTokenCount) &&
        sourceTokenCount >= 1 &&
        sourceTokenCount <= Number.MAX_SAFE_INTEGER,
      "sourceTokenCount",
    ),
      sourceTokenCount);
    (H.domain(
      Number.isSafeInteger(targetTokenCount) &&
        targetTokenCount >= 0 &&
        targetTokenCount <= Number.MAX_SAFE_INTEGER,
      "targetTokenCount",
    ),
      targetTokenCount);
    return {
      targetToSourceRatio: targetTokenCount / sourceTokenCount,
      difference: targetTokenCount - sourceTokenCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceTokenCount: 80, targetTokenCount: 100 },
  output: { targetToSourceRatio: 1.25, difference: 20 },
} satisfies ToolExample<Input, Output>;
export const parallelPassageTokenLengthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/parallel-passage-token-length-ratio",
    title: "Parallel Passage Token Length Ratio",
    description:
      "Compare explicitly tokenized parallel-passage lengths without selecting a tokenizer or judging translation fidelity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTokenCount: { type: "integer", minimum: 1 },
        targetTokenCount: { type: "integer", minimum: 0 },
      },
      required: ["sourceTokenCount", "targetTokenCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetToSourceRatio: { type: "number" },
        difference: { type: "integer" },
      },
      required: ["targetToSourceRatio", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "sourceTokenCount",
          label: "Source Token Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetTokenCount",
          label: "Target Token Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "targetToSourceRatio",
          label: "Target To Source Ratio",
          valueType: { type: "number" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = parallelPassageTokenLengthRatioTool.execute;
export default parallelPassageTokenLengthRatioTool;
