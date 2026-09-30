import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly row: number; readonly column: number };
export type Output = {
  readonly signedBand: number;
  readonly distanceFromDiagonal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer", minimum: 0 },
    column: { type: "integer", minimum: 0 },
  },
  required: ["row", "column"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedBand: { type: "integer" },
    distanceFromDiagonal: { type: "integer" },
  },
  required: ["signedBand", "distanceFromDiagonal"],
} as const;
/** Calculate matrix diagonal band index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column } = request;
  const compute = (): Output => {
    H.integer(row, 0);
    H.integer(column, 0);
    return {
      signedBand: column - row,
      distanceFromDiagonal: Math.abs(column - row),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: 2, column: 5 },
  output: { signedBand: 3, distanceFromDiagonal: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixDiagonalBandIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-diagonal-band-index",
    title: "Matrix Diagonal Band Index Tool",
    description:
      "Calculate matrix diagonal band index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer", minimum: 0 },
        column: { type: "integer", minimum: 0 },
      },
      required: ["row", "column"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedBand: { type: "integer" },
        distanceFromDiagonal: { type: "integer" },
      },
      required: ["signedBand", "distanceFromDiagonal"],
    },
    ports: {
      inputs: [
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "signedBand",
          label: "Signed Band",
          valueType: { type: "integer" },
        },
        {
          id: "distanceFromDiagonal",
          label: "Distance From Diagonal",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixDiagonalBandIndexTool.execute;
export default matrixDiagonalBandIndexTool;
