import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly degree: number; readonly index: number };
export type Output = { readonly oppositeIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degree: { type: "integer", minimum: 0, maximum: 1000000 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["degree", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { oppositeIndex: { type: "integer" } },
  required: ["oppositeIndex"],
} as const;
/** Compute polynomial descending ascending index pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { degree, index } = input;
  const compute = (): Output => {
    integer(degree, 0, 1000000);
    integer(index, 0, degree);
    return { oppositeIndex: degree - index };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { degree: 5, index: 1 },
  output: { oppositeIndex: 4 },
} satisfies ToolExample<Input, Output>;
export const polynomialDescendingAscendingIndexPairTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/polynomial-descending-ascending-index-pair",
    title: "Polynomial Descending Ascending Index Pair Tool",
    description:
      "Compute polynomial descending ascending index pair from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "degree",
          label: "Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "oppositeIndex",
          label: "Opposite Index",
          valueType: { type: "integer" },
        },
      ],
    },
  });
export const run = polynomialDescendingAscendingIndexPairTool.execute;
export default polynomialDescendingAscendingIndexPairTool;
