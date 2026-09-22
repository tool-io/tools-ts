import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly layerThicknesses: readonly number[];
  readonly referenceLayer: number;
  readonly offsetInsideLayer: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerThicknesses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    referenceLayer: { type: "integer", minimum: 0 },
    offsetInsideLayer: { type: "number", minimum: 0 },
  },
  required: ["layerThicknesses", "referenceLayer", "offsetInsideLayer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Locate a plane by supplied layer order and distance from the selected layer face. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { layerThicknesses, referenceLayer, offsetInsideLayer } = request;
  const compute = (): Output => {
    H.domain(
      layerThicknesses.length > 0 && layerThicknesses.every((x) => x >= 0),
    );
    H.integer(referenceLayer, 0, layerThicknesses.length - 1);
    H.domain(
      offsetInsideLayer >= 0 &&
        offsetInsideLayer <= layerThicknesses[referenceLayer],
    );
    return {
      offset:
        layerThicknesses.slice(0, referenceLayer).reduce((a, b) => a + b, 0) +
        offsetInsideLayer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    layerThicknesses: [0.1, 0.2, 0.05],
    referenceLayer: 1,
    offsetInsideLayer: 0.08,
  },
  output: { offset: 0.18 },
} satisfies ToolExample<Input, Output>;
export const wallLayerReferencePlaneOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/wall-layer-reference-plane-offset",
    title: "Wall Layer Reference Plane Offset Tool",
    description:
      "Locate a plane by supplied layer order and distance from the selected layer face.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerThicknesses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceLayer: { type: "integer", minimum: 0 },
        offsetInsideLayer: { type: "number", minimum: 0 },
      },
      required: ["layerThicknesses", "referenceLayer", "offsetInsideLayer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "layerThicknesses",
          label: "Layer Thicknesses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceLayer",
          label: "Reference Layer",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offsetInsideLayer",
          label: "Offset Inside Layer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wallLayerReferencePlaneOffsetTool.execute;
export default wallLayerReferencePlaneOffsetTool;
