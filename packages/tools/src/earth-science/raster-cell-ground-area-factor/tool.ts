import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly horizontalScale: number;
  readonly verticalScale: number;
};
export type Output = { readonly groundArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellWidth: { type: "number", minimum: 0 },
    cellHeight: { type: "number", minimum: 0 },
    horizontalScale: { type: "number", exclusiveMinimum: 0 },
    verticalScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["cellWidth", "cellHeight", "horizontalScale", "verticalScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { groundArea: { type: "number" } },
  required: ["groundArea"],
} as const;
/** Calculate raster cell ground area factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellWidth, cellHeight, horizontalScale, verticalScale } = request;
  const compute = (): Output => {
    H.domain(cellWidth >= 0 && cellHeight >= 0);
    H.positive(horizontalScale);
    H.positive(verticalScale);
    return {
      groundArea: cellWidth * cellHeight * horizontalScale * verticalScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cellWidth: 2,
    cellHeight: 3,
    horizontalScale: 10,
    verticalScale: 10,
  },
  output: { groundArea: 600 },
} satisfies ToolExample<Input, Output>;
export const rasterCellGroundAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/raster-cell-ground-area-factor",
    title: "Raster Cell Ground Area Factor Tool",
    description:
      "Calculate raster cell ground area factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellWidth: { type: "number", minimum: 0 },
        cellHeight: { type: "number", minimum: 0 },
        horizontalScale: { type: "number", exclusiveMinimum: 0 },
        verticalScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["cellWidth", "cellHeight", "horizontalScale", "verticalScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { groundArea: { type: "number" } },
      required: ["groundArea"],
    },
    ports: {
      inputs: [
        {
          id: "cellWidth",
          label: "Cell Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellHeight",
          label: "Cell Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalScale",
          label: "Horizontal Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "verticalScale",
          label: "Vertical Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "groundArea",
          label: "Ground Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rasterCellGroundAreaFactorTool.execute;
export default rasterCellGroundAreaFactorTool;
