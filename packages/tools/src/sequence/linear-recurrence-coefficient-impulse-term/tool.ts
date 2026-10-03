import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly coefficients: readonly number[];
  readonly index: number;
  readonly impulse: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: { type: "array", maxItems: 256, items: { type: "number" } },
    index: { type: "integer", minimum: 0 },
    impulse: { type: "number" },
  },
  required: ["coefficients", "index", "impulse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Compute linear recurrence coefficient impulse term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { coefficients, index, impulse } = input;
  const compute = (): Output => {
    integer(index, 0, coefficients.length - 1);
    return { contribution: coefficients[index] * impulse };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coefficients: [2, -1], index: 1, impulse: 3 },
  output: { contribution: -3 },
} satisfies ToolExample<Input, Output>;
export const linearRecurrenceCoefficientImpulseTermTool =
  defineSchemaCalculation<Input, Output>({
    id: "sequence/linear-recurrence-coefficient-impulse-term",
    title: "Linear Recurrence Coefficient Impulse Term Tool",
    description:
      "Compute linear recurrence coefficient impulse term from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "coefficients",
          label: "Coefficients",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "impulse",
          label: "Impulse",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = linearRecurrenceCoefficientImpulseTermTool.execute;
export default linearRecurrenceCoefficientImpulseTermTool;
