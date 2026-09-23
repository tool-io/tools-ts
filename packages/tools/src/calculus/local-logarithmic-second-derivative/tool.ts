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
  readonly first: number;
  readonly second: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    first: { type: "number" },
    second: { type: "number" },
  },
  required: ["value", "first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Compute local logarithmic second derivative from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, first, second } = input;
  const compute = (): Output => {
    domain(value !== 0);
    return { derivative: second / value - (first / value) ** 2 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 2, first: 4, second: 10 },
  output: { derivative: 1 },
} satisfies ToolExample<Input, Output>;
export const localLogarithmicSecondDerivativeTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/local-logarithmic-second-derivative",
  title: "Local Logarithmic Second Derivative Tool",
  description:
    "Compute local logarithmic second derivative from explicit bounded inputs.",
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
    ],
    outputs: [
      { id: "derivative", label: "Derivative", valueType: { type: "number" } },
    ],
  },
});
export const run = localLogarithmicSecondDerivativeTool.execute;
export default localLogarithmicSecondDerivativeTool;
