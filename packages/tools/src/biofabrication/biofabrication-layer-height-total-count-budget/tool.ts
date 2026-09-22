import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetHeight: number;
  readonly layerHeight: number;
  readonly baseOffset: number;
};
export type Output = {
  readonly completeLayers: number;
  readonly residualHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetHeight: { type: "number" },
    layerHeight: { type: "number", exclusiveMinimum: 0 },
    baseOffset: { type: "number", minimum: 0 },
  },
  required: ["targetHeight", "layerHeight", "baseOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeLayers: { type: "integer" },
    residualHeight: { type: "number" },
  },
  required: ["completeLayers", "residualHeight"],
} as const;
/** Calculate biofabrication layer height total count budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetHeight, layerHeight, baseOffset } = request;
  const compute = (): Output => {
    H.positive(layerHeight);
    H.domain(targetHeight >= baseOffset && baseOffset >= 0);
    return {
      completeLayers: Math.floor((targetHeight - baseOffset) / layerHeight),
      residualHeight:
        targetHeight -
        baseOffset -
        Math.floor((targetHeight - baseOffset) / layerHeight) * layerHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetHeight: 10, layerHeight: 0.3, baseOffset: 1 },
  output: { completeLayers: 30, residualHeight: 0 },
} satisfies ToolExample<Input, Output>;
export const biofabricationLayerHeightTotalCountBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biofabrication/biofabrication-layer-height-total-count-budget",
      title: "Biofabrication Layer Height Total Count Budget Tool",
      description:
        "Calculate biofabrication layer height total count budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetHeight: { type: "number" },
          layerHeight: { type: "number", exclusiveMinimum: 0 },
          baseOffset: { type: "number", minimum: 0 },
        },
        required: ["targetHeight", "layerHeight", "baseOffset"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          completeLayers: { type: "integer" },
          residualHeight: { type: "number" },
        },
        required: ["completeLayers", "residualHeight"],
      },
      ports: {
        inputs: [
          {
            id: "targetHeight",
            label: "Target Height",
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
            id: "baseOffset",
            label: "Base Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "completeLayers",
            label: "Complete Layers",
            valueType: { type: "integer" },
          },
          {
            id: "residualHeight",
            label: "Residual Height",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biofabricationLayerHeightTotalCountBudgetTool.execute;
export default biofabricationLayerHeightTotalCountBudgetTool;
