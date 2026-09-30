import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly row: readonly number[];
  readonly pivotColumn: number;
};
export type Output = {
  readonly ratio: number;
  readonly scale: number;
  readonly zeroRow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "array", maxItems: 256, items: { type: "number" } },
    pivotColumn: { type: "integer", minimum: 0 },
  },
  required: ["row", "pivotColumn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    scale: { type: "number" },
    zeroRow: { type: "boolean" },
  },
  required: ["ratio", "scale", "zeroRow"],
} as const;
/** Compute matrix row pivot scale ratio from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { row, pivotColumn } = input;
  const compute = (): Output => {
    integer(pivotColumn, 0, row.length - 1);
    const scale = Math.max(...row.map(Math.abs));
    return {
      ratio: scale === 0 ? 0 : Math.abs(row[pivotColumn]) / scale,
      scale,
      zeroRow: scale === 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { row: [2, -4], pivotColumn: 0 },
  output: { ratio: 0.5, scale: 4, zeroRow: false },
} satisfies ToolExample<Input, Output>;
export const matrixRowPivotScaleRatioTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-row-pivot-scale-ratio",
  title: "Matrix Row Pivot Scale Ratio Tool",
  description:
    "Compute matrix row pivot scale ratio from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "row",
        label: "Row",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "pivotColumn",
        label: "Pivot Column",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      { id: "scale", label: "Scale", valueType: { type: "number" } },
      { id: "zeroRow", label: "Zero Row", valueType: { type: "boolean" } },
    ],
  },
});
export const run = matrixRowPivotScaleRatioTool.execute;
export default matrixRowPivotScaleRatioTool;
