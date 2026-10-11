import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldId: string;
  readonly gridVersion: string;
  readonly cellCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldId: { type: "string", maxLength: 8192, minLength: 1 },
    gridVersion: { type: "string", maxLength: 8192, minLength: 1 },
    cellCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["fieldId", "gridVersion", "cellCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit soil-grid sample cell code by field and grid version without locating coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldId, gridVersion, cellCode } = request;
  const compute = (): Output => {
    H.domain(fieldId.length > 0, "fieldId");
    H.domain(gridVersion.length > 0, "gridVersion");
    H.domain(cellCode.length > 0, "cellCode");
    return { token: JSON.stringify([fieldId, gridVersion, cellCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldId: "F17", gridVersion: "v2", cellCode: "R3C4" },
  output: { token: '["F17","v2","R3C4"]' },
} satisfies ToolExample<Input, Output>;
export const soilGridSampleCellIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["precision-agriculture", "precision agriculture", "agriculture"],
      keywords: ["precision agriculture", "agriculture"],
    },
    id: "precision-agriculture/soil-grid-sample-cell-id",
    title: "Soil Grid Sample Cell ID",
    description:
      "Qualify an explicit soil-grid sample cell code by field and grid version without locating coordinates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldId: { type: "string", maxLength: 8192, minLength: 1 },
        gridVersion: { type: "string", maxLength: 8192, minLength: 1 },
        cellCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["fieldId", "gridVersion", "cellCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "fieldId",
          label: "Field Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "gridVersion",
          label: "Grid Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cellCode",
          label: "Cell Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = soilGridSampleCellIdTool.execute;
export default soilGridSampleCellIdTool;
