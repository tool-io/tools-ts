import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerThreshold: number;
  readonly upperThreshold: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerThreshold: { type: "number" },
    upperThreshold: { type: "number" },
  },
  required: ["lowerThreshold", "upperThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit adjacent ordinal cutpoints, retaining nonpositive gaps as ordering diagnostics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerThreshold, upperThreshold } = request;
  const compute = (): Output => {
    return { signedGap: upperThreshold - lowerThreshold };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerThreshold: 12, upperThreshold: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const ordinalLabelAdjacentThresholdGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: ["classification", "classification metrics", "computer science"],
      keywords: ["classification metrics", "computer science"],
    },
    id: "classification/ordinal-label-adjacent-threshold-gap",
    title: "Ordinal Label Adjacent Threshold Gap",
    description:
      "Subtract explicit adjacent ordinal cutpoints, retaining nonpositive gaps as ordering diagnostics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerThreshold: { type: "number" },
        upperThreshold: { type: "number" },
      },
      required: ["lowerThreshold", "upperThreshold"],
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
          id: "lowerThreshold",
          label: "Lower Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperThreshold",
          label: "Upper Threshold",
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
export const run = ordinalLabelAdjacentThresholdGapTool.execute;
export default ordinalLabelAdjacentThresholdGapTool;
