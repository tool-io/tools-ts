import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingOpticalDepth: number;
  readonly extinctionCoefficient: number;
  readonly layerThickness: number;
};
export type Output = {
  readonly closingOpticalDepth: number;
  readonly addedOpticalDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingOpticalDepth: { type: "number", minimum: 0 },
    extinctionCoefficient: { type: "number", minimum: 0 },
    layerThickness: { type: "number", minimum: 0 },
  },
  required: ["openingOpticalDepth", "extinctionCoefficient", "layerThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingOpticalDepth: { type: "number" },
    addedOpticalDepth: { type: "number" },
  },
  required: ["closingOpticalDepth", "addedOpticalDepth"],
} as const;
/** Accumulate one homogeneous layer extinction coefficient times thickness into supplied optical depth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingOpticalDepth, extinctionCoefficient, layerThickness } =
    request;
  const compute = (): Output => {
    H.domain(openingOpticalDepth >= 0, "openingOpticalDepth");
    H.domain(extinctionCoefficient >= 0, "extinctionCoefficient");
    H.domain(layerThickness >= 0, "layerThickness");
    return {
      closingOpticalDepth:
        openingOpticalDepth + extinctionCoefficient * layerThickness,
      addedOpticalDepth: extinctionCoefficient * layerThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingOpticalDepth: 1,
    extinctionCoefficient: 0.2,
    layerThickness: 5,
  },
  output: { closingOpticalDepth: 2, addedOpticalDepth: 1 },
} satisfies ToolExample<Input, Output>;
export const cloudLayerOpticalDepthStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-physics", "atmospheric physics", "physics"],
      keywords: ["atmospheric physics", "physics"],
    },
    id: "atmospheric-physics/cloud-layer-optical-depth-step",
    title: "Cloud Layer Optical Depth Step",
    description:
      "Accumulate one homogeneous layer extinction coefficient times thickness into supplied optical depth.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingOpticalDepth: { type: "number", minimum: 0 },
        extinctionCoefficient: { type: "number", minimum: 0 },
        layerThickness: { type: "number", minimum: 0 },
      },
      required: [
        "openingOpticalDepth",
        "extinctionCoefficient",
        "layerThickness",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closingOpticalDepth: { type: "number" },
        addedOpticalDepth: { type: "number" },
      },
      required: ["closingOpticalDepth", "addedOpticalDepth"],
    },
    ports: {
      inputs: [
        {
          id: "openingOpticalDepth",
          label: "Opening Optical Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extinctionCoefficient",
          label: "Extinction Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "layerThickness",
          label: "Layer Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingOpticalDepth",
          label: "Closing Optical Depth",
          valueType: { type: "number" },
        },
        {
          id: "addedOpticalDepth",
          label: "Added Optical Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cloudLayerOpticalDepthStepTool.execute;
export default cloudLayerOpticalDepthStepTool;
