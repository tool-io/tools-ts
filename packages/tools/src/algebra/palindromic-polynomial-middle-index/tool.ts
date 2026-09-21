import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly degree: number };
export type Output = {
  readonly middleIndex: number;
  readonly uniqueMiddle: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { degree: { type: "integer", minimum: 0 } },
  required: ["degree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    middleIndex: { type: "integer" },
    uniqueMiddle: { type: "boolean" },
  },
  required: ["middleIndex", "uniqueMiddle"],
} as const;
/** Calculate palindromic polynomial middle index from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { degree } = input;
  const compute = (): Output => {
    H.integer(degree, 0);
    return {
      middleIndex: Math.floor(degree / 2),
      uniqueMiddle: degree % 2 === 0,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { degree: 6 },
  output: { middleIndex: 3, uniqueMiddle: true },
} satisfies ToolExample<Input, Output>;
export const palindromicPolynomialMiddleIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/palindromic-polynomial-middle-index",
    title: "Palindromic Polynomial Middle Index Tool",
    description:
      "Calculate palindromic polynomial middle index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { degree: { type: "integer", minimum: 0 } },
      required: ["degree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        middleIndex: { type: "integer" },
        uniqueMiddle: { type: "boolean" },
      },
      required: ["middleIndex", "uniqueMiddle"],
    },
    ports: {
      inputs: [
        {
          id: "degree",
          label: "Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "middleIndex",
          label: "Middle Index",
          valueType: { type: "integer" },
        },
        {
          id: "uniqueMiddle",
          label: "Unique Middle",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = palindromicPolynomialMiddleIndexTool.execute;
export default palindromicPolynomialMiddleIndexTool;
