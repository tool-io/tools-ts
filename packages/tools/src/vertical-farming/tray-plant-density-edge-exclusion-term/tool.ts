import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plants: number;
  readonly width: number;
  readonly depth: number;
  readonly edgeMargin: number;
};
export type Output = { readonly usableArea: number; readonly density: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plants: { type: "integer", minimum: 0 },
    width: { type: "number" },
    depth: { type: "number" },
    edgeMargin: { type: "number", minimum: 0 },
  },
  required: ["plants", "width", "depth", "edgeMargin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableArea: { type: "number" }, density: { type: "number" } },
  required: ["usableArea", "density"],
} as const;
/** Calculate tray plant density edge exclusion term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plants, width, depth, edgeMargin } = request;
  const compute = (): Output => {
    H.integer(plants, 0);
    H.domain(
      edgeMargin >= 0 && width > 2 * edgeMargin && depth > 2 * edgeMargin,
    );
    return {
      usableArea: (width - 2 * edgeMargin) * (depth - 2 * edgeMargin),
      density: plants / ((width - 2 * edgeMargin) * (depth - 2 * edgeMargin)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plants: 40, width: 2, depth: 1, edgeMargin: 0.1 },
  output: { usableArea: 1.4400000000000002, density: 27.777777777777775 },
} satisfies ToolExample<Input, Output>;
export const trayPlantDensityEdgeExclusionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/tray-plant-density-edge-exclusion-term",
    title: "Tray Plant Density Edge Exclusion Term Tool",
    description:
      "Calculate tray plant density edge exclusion term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plants: { type: "integer", minimum: 0 },
        width: { type: "number" },
        depth: { type: "number" },
        edgeMargin: { type: "number", minimum: 0 },
      },
      required: ["plants", "width", "depth", "edgeMargin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableArea: { type: "number" },
        density: { type: "number" },
      },
      required: ["usableArea", "density"],
    },
    ports: {
      inputs: [
        {
          id: "plants",
          label: "Plants",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edgeMargin",
          label: "Edge Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableArea",
          label: "Usable Area",
          valueType: { type: "number" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = trayPlantDensityEdgeExclusionTermTool.execute;
export default trayPlantDensityEdgeExclusionTermTool;
