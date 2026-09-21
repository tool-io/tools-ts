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
export type Output = {
  readonly poleOrder: number;
  readonly removable: boolean;
};
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
  properties: {
    poleOrder: { type: "integer" },
    removable: { type: "boolean" },
  },
  required: ["poleOrder", "removable"],
} as const;
/** Compute rational function pole order from orders from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { numeratorOrder, denominatorOrder } = input;
  const compute = (): Output => {
    integer(numeratorOrder);
    integer(denominatorOrder);
    return {
      poleOrder: Math.max(0, denominatorOrder - numeratorOrder),
      removable: denominatorOrder > 0 && numeratorOrder >= denominatorOrder,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { numeratorOrder: 1, denominatorOrder: 3 },
  output: { poleOrder: 2, removable: false },
} satisfies ToolExample<Input, Output>;
export const rationalFunctionPoleOrderFromOrdersTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/rational-function-pole-order-from-orders",
  title: "Rational Function Pole Order From Orders Tool",
  description:
    "Compute rational function pole order from orders from explicit bounded inputs.",
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
      { id: "poleOrder", label: "Pole Order", valueType: { type: "integer" } },
      { id: "removable", label: "Removable", valueType: { type: "boolean" } },
    ],
  },
});
export const run = rationalFunctionPoleOrderFromOrdersTool.execute;
export default rationalFunctionPoleOrderFromOrdersTool;
