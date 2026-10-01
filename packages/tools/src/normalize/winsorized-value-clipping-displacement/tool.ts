import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly value: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = { readonly value: number; readonly displacement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["value", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, displacement: { type: "number" } },
  required: ["value", "displacement"],
} as const;
/** Compute winsorized value clipping displacement from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, lower, upper } = input;
  const compute = (): Output => {
    domain(lower <= upper);
    const clipped = Math.max(lower, Math.min(upper, value));
    return { value: clipped, displacement: clipped - value };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 12, lower: 0, upper: 10 },
  output: { value: 10, displacement: -2 },
} satisfies ToolExample<Input, Output>;
export const winsorizedValueClippingDisplacementTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "normalize/winsorized-value-clipping-displacement",
  title: "Winsorized Value Clipping Displacement Tool",
  description:
    "Compute winsorized value clipping displacement from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "lower",
        label: "Lower",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "upper",
        label: "Upper",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "value", label: "Value", valueType: { type: "number" } },
      {
        id: "displacement",
        label: "Displacement",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = winsorizedValueClippingDisplacementTool.execute;
export default winsorizedValueClippingDisplacementTool;
