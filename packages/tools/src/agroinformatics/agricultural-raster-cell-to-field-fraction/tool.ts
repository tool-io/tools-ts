import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellArea: number;
  readonly intersectedArea: number;
  readonly cellValue: number;
  readonly intensive: boolean;
};
export type Output = {
  readonly fraction: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellArea: { type: "number", exclusiveMinimum: 0 },
    intersectedArea: { type: "number", minimum: 0 },
    cellValue: { type: "number" },
    intensive: { type: "boolean" },
  },
  required: ["cellArea", "intersectedArea", "cellValue", "intensive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["fraction", "contribution"],
} as const;
/** Calculate agricultural raster cell to field fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellArea, intersectedArea, cellValue, intensive } = request;
  const compute = (): Output => {
    H.positive(cellArea);
    H.domain(intersectedArea >= 0 && intersectedArea <= cellArea);
    return {
      fraction: intersectedArea / cellArea,
      contribution: intensive
        ? cellValue * intersectedArea
        : (cellValue * intersectedArea) / cellArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellArea: 100, intersectedArea: 25, cellValue: 8, intensive: false },
  output: { fraction: 0.25, contribution: 2 },
} satisfies ToolExample<Input, Output>;
export const agriculturalRasterCellToFieldFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroinformatics/agricultural-raster-cell-to-field-fraction",
      title: "Agricultural Raster Cell To Field Fraction Tool",
      description:
        "Calculate agricultural raster cell to field fraction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cellArea: { type: "number", exclusiveMinimum: 0 },
          intersectedArea: { type: "number", minimum: 0 },
          cellValue: { type: "number" },
          intensive: { type: "boolean" },
        },
        required: ["cellArea", "intersectedArea", "cellValue", "intensive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          contribution: { type: "number" },
        },
        required: ["fraction", "contribution"],
      },
      ports: {
        inputs: [
          {
            id: "cellArea",
            label: "Cell Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "intersectedArea",
            label: "Intersected Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cellValue",
            label: "Cell Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "intensive",
            label: "Intensive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalRasterCellToFieldFractionTool.execute;
export default agriculturalRasterCellToFieldFractionTool;
