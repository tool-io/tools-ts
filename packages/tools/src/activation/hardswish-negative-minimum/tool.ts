import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scale: number };
export type Output = { readonly input: number; readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scale: { type: "number", exclusiveMinimum: 0 } },
  required: ["scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { input: { type: "number" }, value: { type: "number" } },
  required: ["input", "value"],
} as const;
/** Find the minimum of x*clamp(x+scale,0,2*scale)/(2*scale) on its quadratic branch. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scale } = request;
  const compute = (): Output => {
    H.positive(scale);
    return { input: -scale / 2, value: -scale / 8 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scale: 3 },
  output: { input: -1.5, value: -0.375 },
} satisfies ToolExample<Input, Output>;
export const hardswishNegativeMinimumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/hardswish-negative-minimum",
    title: "HardSwish Negative Minimum Tool",
    description:
      "Find the minimum of x*clamp(x+scale,0,2*scale)/(2*scale) on its quadratic branch.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scale: { type: "number", exclusiveMinimum: 0 } },
      required: ["scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { input: { type: "number" }, value: { type: "number" } },
      required: ["input", "value"],
    },
    ports: {
      inputs: [
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "input", label: "Input", valueType: { type: "number" } },
        { id: "value", label: "Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hardswishNegativeMinimumTool.execute;
export default hardswishNegativeMinimumTool;
