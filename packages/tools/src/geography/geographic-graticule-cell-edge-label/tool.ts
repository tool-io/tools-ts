import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellId: string;
  readonly edgeWording: string;
  readonly gridSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellId: { type: "string", maxLength: 8192, minLength: 1 },
    edgeWording: { type: "string", maxLength: 8192, minLength: 1 },
    gridSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["cellId", "edgeWording", "gridSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit graticule edge label by grid source without calculating cell geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellId, edgeWording, gridSource } = request;
  const compute = (): Output => {
    H.domain(cellId.length > 0, "cellId");
    H.domain(edgeWording.length > 0, "edgeWording");
    H.domain(gridSource.length > 0, "gridSource");
    return { token: JSON.stringify([cellId, edgeWording, gridSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellId: "CELL17", edgeWording: "north edge", gridSource: "Grid A" },
  output: { token: '["CELL17","north edge","Grid A"]' },
} satisfies ToolExample<Input, Output>;
export const geographicGraticuleCellEdgeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geography", "earth and environmental sciences"],
      keywords: ["geography", "earth and environmental sciences"],
    },
    id: "geography/geographic-graticule-cell-edge-label",
    title: "Geographic Graticule Cell Edge Label",
    description:
      "Qualify an explicit graticule edge label by grid source without calculating cell geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellId: { type: "string", maxLength: 8192, minLength: 1 },
        edgeWording: { type: "string", maxLength: 8192, minLength: 1 },
        gridSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["cellId", "edgeWording", "gridSource"],
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
          id: "cellId",
          label: "Cell Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edgeWording",
          label: "Edge Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "gridSource",
          label: "Grid Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = geographicGraticuleCellEdgeLabelTool.execute;
export default geographicGraticuleCellEdgeLabelTool;
