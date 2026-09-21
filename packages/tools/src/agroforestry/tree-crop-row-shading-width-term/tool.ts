import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly canopyWidth: number;
  readonly treeHeight: number;
  readonly cropHeight: number;
  readonly solarAltitude: number;
};
export type Output = { readonly projectedWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canopyWidth: { type: "number", minimum: 0 },
    treeHeight: { type: "number" },
    cropHeight: { type: "number" },
    solarAltitude: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["canopyWidth", "treeHeight", "cropHeight", "solarAltitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { projectedWidth: { type: "number" } },
  required: ["projectedWidth"],
} as const;
/** Ideal supplied canopy-width plus vertical shadow projection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { canopyWidth, treeHeight, cropHeight, solarAltitude } = request;
  const compute = (): Output => {
    H.domain(
      canopyWidth >= 0 && solarAltitude > 0 && solarAltitude < Math.PI / 2,
    );
    return {
      projectedWidth:
        canopyWidth +
        Math.max(0, treeHeight - cropHeight) / Math.tan(solarAltitude),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    canopyWidth: 2,
    treeHeight: 5,
    cropHeight: 1,
    solarAltitude: 0.7853981633974483,
  },
  output: { projectedWidth: 6.000000000000001 },
} satisfies ToolExample<Input, Output>;
export const treeCropRowShadingWidthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/tree-crop-row-shading-width-term",
    title: "Tree Crop Row Shading Width Term Tool",
    description: "Ideal supplied canopy-width plus vertical shadow projection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canopyWidth: { type: "number", minimum: 0 },
        treeHeight: { type: "number" },
        cropHeight: { type: "number" },
        solarAltitude: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["canopyWidth", "treeHeight", "cropHeight", "solarAltitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { projectedWidth: { type: "number" } },
      required: ["projectedWidth"],
    },
    ports: {
      inputs: [
        {
          id: "canopyWidth",
          label: "Canopy Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "treeHeight",
          label: "Tree Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cropHeight",
          label: "Crop Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solarAltitude",
          label: "Solar Altitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "projectedWidth",
          label: "Projected Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeCropRowShadingWidthTermTool.execute;
export default treeCropRowShadingWidthTermTool;
