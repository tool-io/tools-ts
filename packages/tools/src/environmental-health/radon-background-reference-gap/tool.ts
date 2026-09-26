import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly background: number;
  readonly suppliedScale: number;
  readonly reference: number;
};
export type Output = {
  readonly corrected: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    background: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    reference: { type: "number" },
  },
  required: ["measured", "background", "suppliedScale", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    corrected: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["corrected", "referenceGap"],
} as const;
/** Supplied detector-background/reference arithmetic without interpreting health risk or action levels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, background, suppliedScale, reference } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      corrected: (measured - background) * suppliedScale,
      referenceGap: (measured - background) * suppliedScale - reference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 20, background: 5, suppliedScale: 2, reference: 25 },
  output: { corrected: 30, referenceGap: 5 },
} satisfies ToolExample<Input, Output>;
export const radonBackgroundReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/radon-background-reference-gap",
    title: "Radon Background Reference Gap Tool",
    description:
      "Supplied detector-background/reference arithmetic without interpreting health risk or action levels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number" },
        background: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        reference: { type: "number" },
      },
      required: ["measured", "background", "suppliedScale", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["corrected", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "background",
          label: "Background",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radonBackgroundReferenceGapTool.execute;
export default radonBackgroundReferenceGapTool;
