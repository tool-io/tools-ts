import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellHasData: boolean;
  readonly suppliedValueText: string;
  readonly nodataToken: string;
};
export type Output = { readonly cellText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellHasData: { type: "boolean" },
    suppliedValueText: { type: "string", maxLength: 8192 },
    nodataToken: { type: "string", maxLength: 8192 },
  },
  required: ["cellHasData", "suppliedValueText", "nodataToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cellText: { type: "string", maxLength: 8192 } },
  required: ["cellText"],
} as const;
/** Choose explicit geophysical grid value text or a supplied no-data marker without conflating valid zero and missing cells. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellHasData, suppliedValueText, nodataToken } = request;
  const compute = (): Output => {
    return { cellText: cellHasData ? suppliedValueText : nodataToken };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellHasData: false, suppliedValueText: "12.3", nodataToken: "NA" },
  output: { cellText: "NA" },
} satisfies ToolExample<Input, Output>;
export const geophysicalGridNodataCellTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/geophysical-grid-nodata-cell-token",
    title: "Geophysical Grid Nodata Cell Token Tool",
    description:
      "Choose explicit geophysical grid value text or a supplied no-data marker without conflating valid zero and missing cells.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellHasData: { type: "boolean" },
        suppliedValueText: { type: "string", maxLength: 8192 },
        nodataToken: { type: "string", maxLength: 8192 },
      },
      required: ["cellHasData", "suppliedValueText", "nodataToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cellText: { type: "string", maxLength: 8192 } },
      required: ["cellText"],
    },
    ports: {
      inputs: [
        {
          id: "cellHasData",
          label: "Cell Has Data",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedValueText",
          label: "Supplied Value Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nodataToken",
          label: "Nodata Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "cellText", label: "Cell Text", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = geophysicalGridNodataCellTokenTool.execute;
export default geophysicalGridNodataCellTokenTool;
