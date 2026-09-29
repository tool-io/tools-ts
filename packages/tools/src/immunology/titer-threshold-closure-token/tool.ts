import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reciprocal: number;
  readonly threshold: number;
  readonly equalityIncluded: boolean;
};
export type Output = { readonly withinSuppliedThreshold: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reciprocal: { type: "integer", minimum: 1 },
    threshold: { type: "integer", minimum: 1 },
    equalityIncluded: { type: "boolean" },
  },
  required: ["reciprocal", "threshold", "equalityIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinSuppliedThreshold: { type: "boolean" } },
  required: ["withinSuppliedThreshold"],
} as const;
/** Evaluate one supplied reciprocal-titer threshold convention; no diagnostic cutoff is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reciprocal, threshold, equalityIncluded } = request;
  const compute = (): Output => {
    H.integer(reciprocal, 1);
    H.integer(threshold, 1);
    return {
      withinSuppliedThreshold: equalityIncluded
        ? reciprocal >= threshold
        : reciprocal > threshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reciprocal: 100, threshold: 100, equalityIncluded: true },
  output: { withinSuppliedThreshold: true },
} satisfies ToolExample<Input, Output>;
export const titerThresholdClosureTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/titer-threshold-closure-token",
    title: "Titer Threshold Closure Token Tool",
    description:
      "Evaluate one supplied reciprocal-titer threshold convention; no diagnostic cutoff is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reciprocal: { type: "integer", minimum: 1 },
        threshold: { type: "integer", minimum: 1 },
        equalityIncluded: { type: "boolean" },
      },
      required: ["reciprocal", "threshold", "equalityIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinSuppliedThreshold: { type: "boolean" } },
      required: ["withinSuppliedThreshold"],
    },
    ports: {
      inputs: [
        {
          id: "reciprocal",
          label: "Reciprocal",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "equalityIncluded",
          label: "Equality Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "withinSuppliedThreshold",
          label: "Within Supplied Threshold",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = titerThresholdClosureTokenTool.execute;
export default titerThresholdClosureTokenTool;
