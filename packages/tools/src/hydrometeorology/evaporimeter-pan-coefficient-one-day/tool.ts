import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panDepth: number;
  readonly panCoefficient: number;
  readonly openWaterArea: number;
};
export type Output = {
  readonly estimatedDepth: number;
  readonly estimatedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panDepth: { type: "number", minimum: 0 },
    panCoefficient: { type: "number", minimum: 0 },
    openWaterArea: { type: "number", minimum: 0 },
  },
  required: ["panDepth", "panCoefficient", "openWaterArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedDepth: { type: "number" },
    estimatedVolume: { type: "number" },
  },
  required: ["estimatedDepth", "estimatedVolume"],
} as const;
/** Supplied pan-coefficient depth scaling with area in matching length units, not a calibrated evaporation forecast. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panDepth, panCoefficient, openWaterArea } = request;
  const compute = (): Output => {
    H.domain(panDepth >= 0 && panCoefficient >= 0 && openWaterArea >= 0);
    return {
      estimatedDepth: panDepth * panCoefficient,
      estimatedVolume: panDepth * panCoefficient * openWaterArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panDepth: 0.005, panCoefficient: 0.8, openWaterArea: 1000 },
  output: { estimatedDepth: 0.004, estimatedVolume: 4 },
} satisfies ToolExample<Input, Output>;
export const evaporimeterPanCoefficientOneDayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/evaporimeter-pan-coefficient-one-day",
    title: "Evaporimeter Pan Coefficient One Day Tool",
    description:
      "Supplied pan-coefficient depth scaling with area in matching length units, not a calibrated evaporation forecast.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panDepth: { type: "number", minimum: 0 },
        panCoefficient: { type: "number", minimum: 0 },
        openWaterArea: { type: "number", minimum: 0 },
      },
      required: ["panDepth", "panCoefficient", "openWaterArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedDepth: { type: "number" },
        estimatedVolume: { type: "number" },
      },
      required: ["estimatedDepth", "estimatedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "panDepth",
          label: "Pan Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "panCoefficient",
          label: "Pan Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openWaterArea",
          label: "Open Water Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedDepth",
          label: "Estimated Depth",
          valueType: { type: "number" },
        },
        {
          id: "estimatedVolume",
          label: "Estimated Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = evaporimeterPanCoefficientOneDayTool.execute;
export default evaporimeterPanCoefficientOneDayTool;
