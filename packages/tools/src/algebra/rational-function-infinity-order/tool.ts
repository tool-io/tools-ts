import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numeratorDegree: number;
  readonly denominatorDegree: number;
};
export type Output = {
  readonly order: number;
  readonly classification: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorDegree: { type: "integer", minimum: 0 },
    denominatorDegree: { type: "integer", minimum: 0 },
  },
  required: ["numeratorDegree", "denominatorDegree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    order: { type: "integer" },
    classification: { type: "string", maxLength: 8192 },
  },
  required: ["order", "classification"],
} as const;
/** Calculate rational function infinity order from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { numeratorDegree, denominatorDegree } = input;
  const compute = (): Output => {
    H.integer(numeratorDegree, 0);
    H.integer(denominatorDegree, 0);
    const order = denominatorDegree - numeratorDegree;
    return {
      order,
      classification:
        order > 0 ? "zero" : order < 0 ? "pole" : "finite-nonzero",
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { numeratorDegree: 2, denominatorDegree: 4 },
  output: { order: 2, classification: "zero" },
} satisfies ToolExample<Input, Output>;
export const rationalFunctionInfinityOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/rational-function-infinity-order",
    title: "Rational Function Infinity Order Tool",
    description:
      "Calculate rational function infinity order from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numeratorDegree: { type: "integer", minimum: 0 },
        denominatorDegree: { type: "integer", minimum: 0 },
      },
      required: ["numeratorDegree", "denominatorDegree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        order: { type: "integer" },
        classification: { type: "string", maxLength: 8192 },
      },
      required: ["order", "classification"],
    },
    ports: {
      inputs: [
        {
          id: "numeratorDegree",
          label: "Numerator Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "denominatorDegree",
          label: "Denominator Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "order", label: "Order", valueType: { type: "integer" } },
        {
          id: "classification",
          label: "Classification",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = rationalFunctionInfinityOrderTool.execute;
export default rationalFunctionInfinityOrderTool;
