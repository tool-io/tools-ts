import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly maximumHeight: number;
  readonly palletHeight: number;
  readonly layerHeight: number;
  readonly separatorHeight: number;
};
export type Output = {
  readonly layers: number;
  readonly usedHeight: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximumHeight: { type: "number" },
    palletHeight: { type: "number", minimum: 0 },
    layerHeight: { type: "number", exclusiveMinimum: 0 },
    separatorHeight: { type: "number", minimum: 0 },
  },
  required: ["maximumHeight", "palletHeight", "layerHeight", "separatorHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layers: { type: "integer" },
    usedHeight: { type: "number" },
    residual: { type: "number" },
  },
  required: ["layers", "usedHeight", "residual"],
} as const;
/** Layer height budget with separators only between layers; input geometry must fit at least one layer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { maximumHeight, palletHeight, layerHeight, separatorHeight } = request;
  const compute = (): Output => {
    H.domain(
      maximumHeight >= palletHeight + layerHeight &&
        palletHeight >= 0 &&
        separatorHeight >= 0,
    );
    H.positive(layerHeight);
    return {
      layers: Math.floor(
        (maximumHeight - palletHeight + separatorHeight) /
          (layerHeight + separatorHeight),
      ),
      usedHeight:
        palletHeight +
        Math.floor(
          (maximumHeight - palletHeight + separatorHeight) /
            (layerHeight + separatorHeight),
        ) *
          (layerHeight + separatorHeight) -
        separatorHeight,
      residual:
        maximumHeight -
        palletHeight -
        Math.floor(
          (maximumHeight - palletHeight + separatorHeight) /
            (layerHeight + separatorHeight),
        ) *
          (layerHeight + separatorHeight) +
        separatorHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    maximumHeight: 150,
    palletHeight: 10,
    layerHeight: 30,
    separatorHeight: 2,
  },
  output: { layers: 4, usedHeight: 136, residual: 14 },
} satisfies ToolExample<Input, Output>;
export const palletLayerHeightRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/pallet-layer-height-remainder",
    title: "Pallet Layer Height Remainder Tool",
    description:
      "Layer height budget with separators only between layers; input geometry must fit at least one layer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maximumHeight: { type: "number" },
        palletHeight: { type: "number", minimum: 0 },
        layerHeight: { type: "number", exclusiveMinimum: 0 },
        separatorHeight: { type: "number", minimum: 0 },
      },
      required: [
        "maximumHeight",
        "palletHeight",
        "layerHeight",
        "separatorHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layers: { type: "integer" },
        usedHeight: { type: "number" },
        residual: { type: "number" },
      },
      required: ["layers", "usedHeight", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "maximumHeight",
          label: "Maximum Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "palletHeight",
          label: "Pallet Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "layerHeight",
          label: "Layer Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "separatorHeight",
          label: "Separator Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "layers", label: "Layers", valueType: { type: "integer" } },
        {
          id: "usedHeight",
          label: "Used Height",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = palletLayerHeightRemainderTool.execute;
export default palletLayerHeightRemainderTool;
