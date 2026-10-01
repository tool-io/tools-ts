import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly originalOrder: number;
  readonly reciprocalOrder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "integer" }, second: { type: "integer" } },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalOrder: { type: "integer" },
    reciprocalOrder: { type: "integer" },
  },
  required: ["originalOrder", "reciprocalOrder"],
} as const;
/** Calculate reciprocal integer fraction order witness from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second } = input;
  const compute = (): Output => {
    H.domain(first !== 0 && second !== 0);
    return {
      originalOrder: Math.sign(first - second),
      reciprocalOrder: Math.sign((second - first) / (first * second)),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 2, second: 4 },
  output: { originalOrder: -1, reciprocalOrder: 1 },
} satisfies ToolExample<Input, Output>;
export const reciprocalIntegerFractionOrderWitnessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "number/reciprocal-integer-fraction-order-witness",
      title: "Reciprocal Integer Fraction Order Witness Tool",
      description:
        "Calculate reciprocal integer fraction order witness from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { first: { type: "integer" }, second: { type: "integer" } },
        required: ["first", "second"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalOrder: { type: "integer" },
          reciprocalOrder: { type: "integer" },
        },
        required: ["originalOrder", "reciprocalOrder"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "originalOrder",
            label: "Original Order",
            valueType: { type: "integer" },
          },
          {
            id: "reciprocalOrder",
            label: "Reciprocal Order",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reciprocalIntegerFractionOrderWitnessTool.execute;
export default reciprocalIntegerFractionOrderWitnessTool;
