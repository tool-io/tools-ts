import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly referenceContrast: number;
};
export type Output = { readonly contrast: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    referenceContrast: { type: "number" },
  },
  required: ["first", "second", "referenceContrast"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contrast: { type: "number" }, residual: { type: "number" } },
  required: ["contrast", "residual"],
} as const;
/** Compare a supplied signed feature difference with a reference; no perceptual contrast model is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, referenceContrast } = request;
  const compute = (): Output => {
    return {
      contrast: first - second,
      residual: first - second - referenceContrast,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 8, second: 3, referenceContrast: 4 },
  output: { contrast: 5, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const stimulusFeatureContrastGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/stimulus-feature-contrast-gap",
    title: "Stimulus Feature Contrast Gap Tool",
    description:
      "Compare a supplied signed feature difference with a reference; no perceptual contrast model is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        referenceContrast: { type: "number" },
      },
      required: ["first", "second", "referenceContrast"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contrast: { type: "number" },
        residual: { type: "number" },
      },
      required: ["contrast", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceContrast",
          label: "Reference Contrast",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "contrast", label: "Contrast", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stimulusFeatureContrastGapTool.execute;
export default stimulusFeatureContrastGapTool;
