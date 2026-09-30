import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDiagonal: number;
  readonly secondDiagonal: number;
};
export type Output = { readonly entry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDiagonal: { type: "number" },
    secondDiagonal: { type: "number" },
  },
  required: ["firstDiagonal", "secondDiagonal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entry: { type: "number" } },
  required: ["entry"],
} as const;
/** Calculate matrix kronecker sum diagonal entry from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstDiagonal, secondDiagonal } = input;
  const compute = (): Output => {
    return { entry: firstDiagonal + secondDiagonal };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstDiagonal: 3, secondDiagonal: 4 },
  output: { entry: 7 },
} satisfies ToolExample<Input, Output>;
export const matrixKroneckerSumDiagonalEntryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-kronecker-sum-diagonal-entry",
    title: "Matrix Kronecker Sum Diagonal Entry Tool",
    description:
      "Calculate matrix kronecker sum diagonal entry from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDiagonal: { type: "number" },
        secondDiagonal: { type: "number" },
      },
      required: ["firstDiagonal", "secondDiagonal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { entry: { type: "number" } },
      required: ["entry"],
    },
    ports: {
      inputs: [
        {
          id: "firstDiagonal",
          label: "First Diagonal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDiagonal",
          label: "Second Diagonal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "entry", label: "Entry", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = matrixKroneckerSumDiagonalEntryTool.execute;
export default matrixKroneckerSumDiagonalEntryTool;
