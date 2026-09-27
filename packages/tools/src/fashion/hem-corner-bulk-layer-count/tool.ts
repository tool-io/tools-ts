import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontalLayers: number;
  readonly verticalLayers: number;
  readonly fabricThickness: number;
};
export type Output = {
  readonly overlapLayers: number;
  readonly extraLayers: number;
  readonly stackThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalLayers: { type: "integer", minimum: 1 },
    verticalLayers: { type: "integer", minimum: 1 },
    fabricThickness: { type: "number", minimum: 0 },
  },
  required: ["horizontalLayers", "verticalLayers", "fabricThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapLayers: { type: "integer" },
    extraLayers: { type: "integer" },
    stackThickness: { type: "number" },
  },
  required: ["overlapLayers", "extraLayers", "stackThickness"],
} as const;
/** Count an ideal untrimmed rectangular cross-fold stack as the product of the two layer counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizontalLayers, verticalLayers, fabricThickness } = request;
  const compute = (): Output => {
    H.integer(horizontalLayers, 1);
    H.integer(verticalLayers, 1);
    H.domain(fabricThickness >= 0);
    return {
      overlapLayers: horizontalLayers * verticalLayers,
      extraLayers:
        horizontalLayers * verticalLayers -
        Math.max(horizontalLayers, verticalLayers),
      stackThickness: horizontalLayers * verticalLayers * fabricThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { horizontalLayers: 3, verticalLayers: 3, fabricThickness: 0.5 },
  output: { overlapLayers: 9, extraLayers: 6, stackThickness: 4.5 },
} satisfies ToolExample<Input, Output>;
export const hemCornerBulkLayerCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/hem-corner-bulk-layer-count",
    title: "Hem Corner Bulk Layer Count Tool",
    description:
      "Count an ideal untrimmed rectangular cross-fold stack as the product of the two layer counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalLayers: { type: "integer", minimum: 1 },
        verticalLayers: { type: "integer", minimum: 1 },
        fabricThickness: { type: "number", minimum: 0 },
      },
      required: ["horizontalLayers", "verticalLayers", "fabricThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapLayers: { type: "integer" },
        extraLayers: { type: "integer" },
        stackThickness: { type: "number" },
      },
      required: ["overlapLayers", "extraLayers", "stackThickness"],
    },
    ports: {
      inputs: [
        {
          id: "horizontalLayers",
          label: "Horizontal Layers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "verticalLayers",
          label: "Vertical Layers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fabricThickness",
          label: "Fabric Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapLayers",
          label: "Overlap Layers",
          valueType: { type: "integer" },
        },
        {
          id: "extraLayers",
          label: "Extra Layers",
          valueType: { type: "integer" },
        },
        {
          id: "stackThickness",
          label: "Stack Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hemCornerBulkLayerCountTool.execute;
export default hemCornerBulkLayerCountTool;
