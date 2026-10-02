import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly multiplier: number;
  readonly offset: number;
};
export type Output = {
  readonly transformedFirst: number;
  readonly transformedSecond: number;
  readonly order: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    multiplier: { type: "number", exclusiveMinimum: 0 },
    offset: { type: "number" },
  },
  required: ["first", "second", "multiplier", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transformedFirst: { type: "number" },
    transformedSecond: { type: "number" },
    order: { type: "integer" },
  },
  required: ["transformedFirst", "transformedSecond", "order"],
} as const;
/** Positive affine transformation preserving the mathematical order; not an interpersonal utility comparison. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, multiplier, offset } = request;
  const compute = (): Output => {
    H.positive(multiplier);
    return {
      transformedFirst: multiplier * first + offset,
      transformedSecond: multiplier * second + offset,
      order: Math.sign(first - second),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 2, second: 3, multiplier: 4, offset: 10 },
  output: { transformedFirst: 18, transformedSecond: 22, order: -1 },
} satisfies ToolExample<Input, Output>;
export const utilityOrderPositiveAffineInvarianceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "philosophy/utility-order-positive-affine-invariance",
      title: "Utility Order Positive Affine Invariance Tool",
      description:
        "Positive affine transformation preserving the mathematical order; not an interpersonal utility comparison.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "number" },
          second: { type: "number" },
          multiplier: { type: "number", exclusiveMinimum: 0 },
          offset: { type: "number" },
        },
        required: ["first", "second", "multiplier", "offset"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transformedFirst: { type: "number" },
          transformedSecond: { type: "number" },
          order: { type: "integer" },
        },
        required: ["transformedFirst", "transformedSecond", "order"],
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
            id: "multiplier",
            label: "Multiplier",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "offset",
            label: "Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "transformedFirst",
            label: "Transformed First",
            valueType: { type: "number" },
          },
          {
            id: "transformedSecond",
            label: "Transformed Second",
            valueType: { type: "number" },
          },
          { id: "order", label: "Order", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = utilityOrderPositiveAffineInvarianceTool.execute;
export default utilityOrderPositiveAffineInvarianceTool;
