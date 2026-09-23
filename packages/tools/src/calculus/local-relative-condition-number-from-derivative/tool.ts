import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly inputValue: number;
  readonly outputValue: number;
  readonly derivative: number;
};
export type Output = { readonly condition: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputValue: { type: "number" },
    outputValue: { type: "number" },
    derivative: { type: "number" },
  },
  required: ["inputValue", "outputValue", "derivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { condition: { type: "number" } },
  required: ["condition"],
} as const;
/** Compute local relative condition number from derivative from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { inputValue, outputValue, derivative } = input;
  const compute = (): Output => {
    domain(outputValue !== 0);
    return { condition: Math.abs((inputValue * derivative) / outputValue) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { inputValue: 2, outputValue: 4, derivative: 4 },
  output: { condition: 2 },
} satisfies ToolExample<Input, Output>;
export const localRelativeConditionNumberFromDerivativeTool =
  defineSchemaCalculation<Input, Output>({
    id: "calculus/local-relative-condition-number-from-derivative",
    title: "Local Relative Condition Number From Derivative Tool",
    description:
      "Compute local relative condition number from derivative from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "inputValue",
          label: "Input Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputValue",
          label: "Output Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "derivative",
          label: "Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "condition", label: "Condition", valueType: { type: "number" } },
      ],
    },
  });
export const run = localRelativeConditionNumberFromDerivativeTool.execute;
export default localRelativeConditionNumberFromDerivativeTool;
