import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entry: number;
  readonly rowScale: number;
  readonly columnScale: number;
};
export type Output = { readonly entry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entry: { type: "number" },
    rowScale: { type: "number" },
    columnScale: { type: "number" },
  },
  required: ["entry", "rowScale", "columnScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entry: { type: "number" } },
  required: ["entry"],
} as const;
/** Return one entry of D^-1 A D for explicitly supplied nonzero diagonal scales. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { entry, rowScale, columnScale } = input;
  const compute = (): Output => {
    H.domain(rowScale !== 0 && columnScale !== 0);
    return { entry: (entry * columnScale) / rowScale };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { entry: 6, rowScale: 2, columnScale: 3 },
  output: { entry: 9 },
} satisfies ToolExample<Input, Output>;
export const matrixDiagonalSimilarityOneEntryFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "matrix/matrix-diagonal-similarity-one-entry-factor",
      title: "Matrix Diagonal Similarity One Entry Factor Tool",
      description:
        "Return one entry of D^-1 A D for explicitly supplied nonzero diagonal scales.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entry: { type: "number" },
          rowScale: { type: "number" },
          columnScale: { type: "number" },
        },
        required: ["entry", "rowScale", "columnScale"],
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
            id: "entry",
            label: "Entry",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rowScale",
            label: "Row Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "columnScale",
            label: "Column Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "entry", label: "Entry", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = matrixDiagonalSimilarityOneEntryFactorTool.execute;
export default matrixDiagonalSimilarityOneEntryFactorTool;
