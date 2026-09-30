import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: readonly number[];
  readonly diagonalIndex: number;
};
export type Output = { readonly center: number; readonly radius: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "array", maxItems: 256, items: { type: "number" } },
    diagonalIndex: { type: "integer", minimum: 0 },
  },
  required: ["row", "diagonalIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { center: { type: "number" }, radius: { type: "number" } },
  required: ["center", "radius"],
} as const;
/** Calculate matrix gershgorin one row disc from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { row, diagonalIndex } = input;
  const compute = (): Output => {
    H.integer(diagonalIndex, 0, row.length - 1);
    return {
      center: row[diagonalIndex],
      radius: row.reduce(
        (a, x, i) => a + (i === diagonalIndex ? 0 : Math.abs(x)),
        0,
      ),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: [2, -3, 4], diagonalIndex: 0 },
  output: { center: 2, radius: 7 },
} satisfies ToolExample<Input, Output>;
export const matrixGershgorinOneRowDiscTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-gershgorin-one-row-disc",
    title: "Matrix Gershgorin One Row Disc Tool",
    description:
      "Calculate matrix gershgorin one row disc from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "array", maxItems: 256, items: { type: "number" } },
        diagonalIndex: { type: "integer", minimum: 0 },
      },
      required: ["row", "diagonalIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { center: { type: "number" }, radius: { type: "number" } },
      required: ["center", "radius"],
    },
    ports: {
      inputs: [
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "diagonalIndex",
          label: "Diagonal Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "center", label: "Center", valueType: { type: "number" } },
        { id: "radius", label: "Radius", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = matrixGershgorinOneRowDiscTool.execute;
export default matrixGershgorinOneRowDiscTool;
