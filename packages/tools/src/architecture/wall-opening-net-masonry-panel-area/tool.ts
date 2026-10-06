import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panelWidth: number;
  readonly panelHeight: number;
  readonly suppliedOpeningArea: number;
};
export type Output = { readonly grossArea: number; readonly netArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panelWidth: { type: "number", minimum: 0 },
    panelHeight: { type: "number", minimum: 0 },
    suppliedOpeningArea: { type: "number", minimum: 0 },
  },
  required: ["panelWidth", "panelHeight", "suppliedOpeningArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { grossArea: { type: "number" }, netArea: { type: "number" } },
  required: ["grossArea", "netArea"],
} as const;
/** Subtract an explicit total nonoverlapping opening area from a rectangular wall-panel area without assessing structural design. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panelWidth, panelHeight, suppliedOpeningArea } = request;
  const compute = (): Output => {
    H.domain(
      panelWidth >= 0 && panelHeight >= 0 && suppliedOpeningArea >= 0,
      "panelWidth",
    );
    H.domain(
      suppliedOpeningArea <= panelWidth * panelHeight,
      "suppliedOpeningArea",
    );
    return {
      grossArea: panelWidth * panelHeight,
      netArea: panelWidth * panelHeight - suppliedOpeningArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panelWidth: 4, panelHeight: 3, suppliedOpeningArea: 2 },
  output: { grossArea: 12, netArea: 10 },
} satisfies ToolExample<Input, Output>;
export const wallOpeningNetMasonryPanelAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["architecture", "arts and design"],
      keywords: ["architecture", "arts and design"],
    },
    id: "architecture/wall-opening-net-masonry-panel-area",
    title: "Wall Opening Net Masonry Panel Area",
    description:
      "Subtract an explicit total nonoverlapping opening area from a rectangular wall-panel area without assessing structural design.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panelWidth: { type: "number", minimum: 0 },
        panelHeight: { type: "number", minimum: 0 },
        suppliedOpeningArea: { type: "number", minimum: 0 },
      },
      required: ["panelWidth", "panelHeight", "suppliedOpeningArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossArea: { type: "number" },
        netArea: { type: "number" },
      },
      required: ["grossArea", "netArea"],
    },
    ports: {
      inputs: [
        {
          id: "panelWidth",
          label: "Panel Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "panelHeight",
          label: "Panel Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOpeningArea",
          label: "Supplied Opening Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grossArea", label: "Gross Area", valueType: { type: "number" } },
        { id: "netArea", label: "Net Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wallOpeningNetMasonryPanelAreaTool.execute;
export default wallOpeningNetMasonryPanelAreaTool;
