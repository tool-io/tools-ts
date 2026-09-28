import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly categoryCells: number;
  readonly countedCells: number;
};
export type Output = { readonly fraction: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    categoryCells: { type: "integer", minimum: 0 },
    countedCells: { type: "integer", minimum: 0 },
  },
  required: ["categoryCells", "countedCells"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, defined: { type: "boolean" } },
  required: ["fraction", "defined"],
} as const;
/** Compute one research cell-category fraction from an explicitly counted-cell denominator; no reference ranges. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { categoryCells, countedCells } = request;
  const compute = (): Output => {
    H.integer(countedCells, 0);
    H.integer(categoryCells, 0, countedCells);
    return {
      fraction: countedCells > 0 ? categoryCells / countedCells : 0,
      defined: countedCells > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { categoryCells: 20, countedCells: 100 },
  output: { fraction: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const differentialCellFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/differential-cell-fraction-term",
    title: "Differential Cell Fraction Term Tool",
    description:
      "Compute one research cell-category fraction from an explicitly counted-cell denominator; no reference ranges.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        categoryCells: { type: "integer", minimum: 0 },
        countedCells: { type: "integer", minimum: 0 },
      },
      required: ["categoryCells", "countedCells"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["fraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "categoryCells",
          label: "Category Cells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countedCells",
          label: "Counted Cells",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = differentialCellFractionTermTool.execute;
export default differentialCellFractionTermTool;
