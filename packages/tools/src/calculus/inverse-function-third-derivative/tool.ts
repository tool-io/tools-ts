import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    third: { type: "number" },
  },
  required: ["first", "second", "third"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate inverse function third derivative from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, third } = input;
  const compute = (): Output => {
    H.domain(first !== 0);
    return { derivative: (3 * second * second - first * third) / first ** 5 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 2, second: 3, third: 4 },
  output: { derivative: 0.59375 },
} satisfies ToolExample<Input, Output>;
export const inverseFunctionThirdDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/inverse-function-third-derivative",
    title: "Inverse Function Third Derivative Tool",
    description:
      "Calculate inverse function third derivative from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        third: { type: "number" },
      },
      required: ["first", "second", "third"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
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
          id: "third",
          label: "Third",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inverseFunctionThirdDerivativeTool.execute;
export default inverseFunctionThirdDerivativeTool;
