import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly firstDerivative: number;
  readonly secondDerivative: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    firstDerivative: { type: "number" },
    secondDerivative: { type: "number" },
  },
  required: ["first", "second", "firstDerivative", "secondDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate derivative of normalized scalar pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, firstDerivative, secondDerivative } = input;
  const compute = (): Output => {
    H.domain(first + second !== 0);
    return {
      derivative:
        (firstDerivative * second - first * secondDerivative) /
        (first + second) ** 2,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 2, second: 3, firstDerivative: 1, secondDerivative: 0 },
  output: { derivative: 0.12 },
} satisfies ToolExample<Input, Output>;
export const derivativeOfNormalizedScalarPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/derivative-of-normalized-scalar-pair",
    title: "Derivative Of Normalized Scalar Pair Tool",
    description:
      "Calculate derivative of normalized scalar pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        firstDerivative: { type: "number" },
        secondDerivative: { type: "number" },
      },
      required: ["first", "second", "firstDerivative", "secondDerivative"],
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
          id: "firstDerivative",
          label: "First Derivative",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDerivative",
          label: "Second Derivative",
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
export const run = derivativeOfNormalizedScalarPairTool.execute;
export default derivativeOfNormalizedScalarPairTool;
