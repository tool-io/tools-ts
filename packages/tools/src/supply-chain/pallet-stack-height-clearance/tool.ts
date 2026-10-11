import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly palletHeight: number;
  readonly loadLayerHeight: number;
  readonly layerCount: number;
  readonly availableClearHeight: number;
};
export type Output = {
  readonly stackHeight: number;
  readonly clearanceMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    palletHeight: { type: "number", minimum: 0 },
    loadLayerHeight: { type: "number", minimum: 0 },
    layerCount: { type: "integer", minimum: 0 },
    availableClearHeight: { type: "number", minimum: 0 },
  },
  required: [
    "palletHeight",
    "loadLayerHeight",
    "layerCount",
    "availableClearHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stackHeight: { type: "number" },
    clearanceMargin: { type: "number" },
  },
  required: ["stackHeight", "clearanceMargin"],
} as const;
/** Compare explicit pallet-plus-layer stack height with supplied clearance without assessing stability or load limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { palletHeight, loadLayerHeight, layerCount, availableClearHeight } =
    request;
  const compute = (): Output => {
    H.domain(
      palletHeight >= 0 && loadLayerHeight >= 0 && availableClearHeight >= 0,
      "palletHeight",
    );
    (H.domain(
      Number.isSafeInteger(layerCount) &&
        layerCount >= 0 &&
        layerCount <= Number.MAX_SAFE_INTEGER,
      "layerCount",
    ),
      layerCount);
    return {
      stackHeight: palletHeight + loadLayerHeight * layerCount,
      clearanceMargin:
        availableClearHeight - palletHeight - loadLayerHeight * layerCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    palletHeight: 15,
    loadLayerHeight: 30,
    layerCount: 4,
    availableClearHeight: 150,
  },
  output: { stackHeight: 135, clearanceMargin: 15 },
} satisfies ToolExample<Input, Output>;
export const palletStackHeightClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["supply-chain", "supply chain", "business and finance"],
      keywords: ["supply chain", "business and finance"],
    },
    id: "supply-chain/pallet-stack-height-clearance",
    title: "Pallet Stack Height Clearance",
    description:
      "Compare explicit pallet-plus-layer stack height with supplied clearance without assessing stability or load limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        palletHeight: { type: "number", minimum: 0 },
        loadLayerHeight: { type: "number", minimum: 0 },
        layerCount: { type: "integer", minimum: 0 },
        availableClearHeight: { type: "number", minimum: 0 },
      },
      required: [
        "palletHeight",
        "loadLayerHeight",
        "layerCount",
        "availableClearHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stackHeight: { type: "number" },
        clearanceMargin: { type: "number" },
      },
      required: ["stackHeight", "clearanceMargin"],
    },
    ports: {
      inputs: [
        {
          id: "palletHeight",
          label: "Pallet Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loadLayerHeight",
          label: "Load Layer Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "layerCount",
          label: "Layer Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "availableClearHeight",
          label: "Available Clear Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stackHeight",
          label: "Stack Height",
          valueType: { type: "number" },
        },
        {
          id: "clearanceMargin",
          label: "Clearance Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = palletStackHeightClearanceTool.execute;
export default palletStackHeightClearanceTool;
