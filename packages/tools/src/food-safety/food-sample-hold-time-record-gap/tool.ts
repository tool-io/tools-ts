import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionSeconds: number;
  readonly analysisSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionSeconds: { type: "number" },
    analysisSeconds: { type: "number" },
  },
  required: ["collectionSeconds", "analysisSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit food-sample collection and analysis timestamps in seconds without selecting safe holding times. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionSeconds, analysisSeconds } = request;
  const compute = (): Output => {
    return { signedGap: analysisSeconds - collectionSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectionSeconds: 12, analysisSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const foodSampleHoldTimeRecordGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["food-safety", "food safety", "research and quality management"],
      keywords: ["food safety", "research and quality management"],
    },
    id: "food-safety/food-sample-hold-time-record-gap",
    title: "Food Sample Hold Time Record Gap",
    description:
      "Subtract explicit food-sample collection and analysis timestamps in seconds without selecting safe holding times.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionSeconds: { type: "number" },
        analysisSeconds: { type: "number" },
      },
      required: ["collectionSeconds", "analysisSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "collectionSeconds",
          label: "Collection Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "analysisSeconds",
          label: "Analysis Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = foodSampleHoldTimeRecordGapTool.execute;
export default foodSampleHoldTimeRecordGapTool;
