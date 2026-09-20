import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly alpha: number; readonly scale: number };
export type Output = { readonly limit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alpha: { type: "number", exclusiveMinimum: 0 },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["alpha", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { limit: { type: "number" } },
  required: ["limit"],
} as const;
/** Return the negative-input SELU asymptote for caller-supplied positive alpha and scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alpha, scale } = request;
  const compute = (): Output => {
    H.positive(alpha);
    H.positive(scale);
    return { limit: -alpha * scale };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { alpha: 1.6732632423543772, scale: 1.0507009873554805 },
  output: { limit: -1.7580993408473766 },
} satisfies ToolExample<Input, Output>;
export const seluNegativeAsymptoteTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/selu-negative-asymptote",
    title: "SELU Negative Asymptote Tool",
    description:
      "Return the negative-input SELU asymptote for caller-supplied positive alpha and scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alpha: { type: "number", exclusiveMinimum: 0 },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["alpha", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { limit: { type: "number" } },
      required: ["limit"],
    },
    ports: {
      inputs: [
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "limit", label: "Limit", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = seluNegativeAsymptoteTool.execute;
export default seluNegativeAsymptoteTool;
