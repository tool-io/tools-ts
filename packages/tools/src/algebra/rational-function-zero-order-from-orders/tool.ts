import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly numeratorOrder: number;
  readonly denominatorOrder: number;
};
export type Output = { readonly zeroOrder: number; readonly pole: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorOrder: { type: "integer", minimum: 0 },
    denominatorOrder: { type: "integer", minimum: 0 },
  },
  required: ["numeratorOrder", "denominatorOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { zeroOrder: { type: "integer" }, pole: { type: "boolean" } },
  required: ["zeroOrder", "pole"],
} as const;
/** Compute rational function zero order from orders from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { numeratorOrder, denominatorOrder } = input;
  const compute = (): Output => {
    integer(numeratorOrder);
    integer(denominatorOrder);
    return {
      zeroOrder: Math.max(0, numeratorOrder - denominatorOrder),
      pole: denominatorOrder > numeratorOrder,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { numeratorOrder: 3, denominatorOrder: 1 },
  output: { zeroOrder: 2, pole: false },
} satisfies ToolExample<Input, Output>;
export const rationalFunctionZeroOrderFromOrdersTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/rational-function-zero-order-from-orders",
  title: "Rational Function Zero Order From Orders Tool",
  description:
    "Compute rational function zero order from orders from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "numeratorOrder",
        label: "Numerator Order",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "denominatorOrder",
        label: "Denominator Order",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "zeroOrder", label: "Zero Order", valueType: { type: "integer" } },
      { id: "pole", label: "Pole", valueType: { type: "boolean" } },
    ],
  },
});
export const run = rationalFunctionZeroOrderFromOrdersTool.execute;
export default rationalFunctionZeroOrderFromOrdersTool;
