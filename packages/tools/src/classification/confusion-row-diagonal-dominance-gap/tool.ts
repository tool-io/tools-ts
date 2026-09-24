import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: readonly number[];
  readonly diagonalIndex: number;
};
export type Output = { readonly gap: number; readonly dominates: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "array", maxItems: 256, items: { type: "integer" } },
    diagonalIndex: { type: "integer", minimum: 0 },
  },
  required: ["row", "diagonalIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" }, dominates: { type: "boolean" } },
  required: ["gap", "dominates"],
} as const;
/** Calculate confusion row diagonal dominance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, diagonalIndex } = request;
  const compute = (): Output => {
    H.integer(diagonalIndex, 0, row.length - 1);
    H.domain(row.every((x) => x >= 0));
    const gap =
      row[diagonalIndex] -
      row.reduce((a, x, i) => a + (i === diagonalIndex ? 0 : x), 0);
    return { gap, dominates: gap >= 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: [8, 2, 1], diagonalIndex: 0 },
  output: { gap: 5, dominates: true },
} satisfies ToolExample<Input, Output>;
export const confusionRowDiagonalDominanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/confusion-row-diagonal-dominance-gap",
    title: "Confusion Row Diagonal Dominance Gap Tool",
    description:
      "Calculate confusion row diagonal dominance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "array", maxItems: 256, items: { type: "integer" } },
        diagonalIndex: { type: "integer", minimum: 0 },
      },
      required: ["row", "diagonalIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" }, dominates: { type: "boolean" } },
      required: ["gap", "dominates"],
    },
    ports: {
      inputs: [
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "diagonalIndex",
          label: "Diagonal Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
        { id: "dominates", label: "Dominates", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = confusionRowDiagonalDominanceGapTool.execute;
export default confusionRowDiagonalDominanceGapTool;
