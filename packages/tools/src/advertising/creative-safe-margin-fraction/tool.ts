import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly margin: number; readonly canvasExtent: number };
export type Output = {
  readonly fraction: number;
  readonly remainingFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number", minimum: 0 },
    canvasExtent: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["margin", "canvasExtent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    remainingFraction: { type: "number" },
  },
  required: ["fraction", "remainingFraction"],
} as const;
/** Express a supplied symmetric creative margin as a fraction, without choosing platform safe-area rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { margin, canvasExtent } = request;
  const compute = (): Output => {
    H.positive(canvasExtent);
    H.domain(margin >= 0 && 2 * margin <= canvasExtent);
    return {
      fraction: margin / canvasExtent,
      remainingFraction: 1 - (2 * margin) / canvasExtent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { margin: 5, canvasExtent: 100 },
  output: { fraction: 0.05, remainingFraction: 0.9 },
} satisfies ToolExample<Input, Output>;
export const creativeSafeMarginFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/creative-safe-margin-fraction",
    title: "Creative Safe Margin Fraction Tool",
    description:
      "Express a supplied symmetric creative margin as a fraction, without choosing platform safe-area rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number", minimum: 0 },
        canvasExtent: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["margin", "canvasExtent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainingFraction: { type: "number" },
      },
      required: ["fraction", "remainingFraction"],
    },
    ports: {
      inputs: [
        {
          id: "margin",
          label: "Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "canvasExtent",
          label: "Canvas Extent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "remainingFraction",
          label: "Remaining Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = creativeSafeMarginFractionTool.execute;
export default creativeSafeMarginFractionTool;
