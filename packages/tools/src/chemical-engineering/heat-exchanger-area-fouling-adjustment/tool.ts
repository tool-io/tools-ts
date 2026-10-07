import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cleanArea: number;
  readonly cleanOverallCoefficient: number;
  readonly fouledOverallCoefficient: number;
};
export type Output = {
  readonly requiredFouledArea: number;
  readonly areaIncrease: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cleanArea: { type: "number", minimum: 0 },
    cleanOverallCoefficient: { type: "number", exclusiveMinimum: 0 },
    fouledOverallCoefficient: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "cleanArea",
    "cleanOverallCoefficient",
    "fouledOverallCoefficient",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredFouledArea: { type: "number" },
    areaIncrease: { type: "number" },
  },
  required: ["requiredFouledArea", "areaIncrease"],
} as const;
/** Rescale supplied heat-exchanger area by clean-to-fouled overall coefficient ratio at fixed duty and driving temperature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cleanArea, cleanOverallCoefficient, fouledOverallCoefficient } =
    request;
  const compute = (): Output => {
    H.domain(cleanArea >= 0, "cleanArea");
    (H.domain(
      Number.isFinite(cleanOverallCoefficient) && cleanOverallCoefficient > 0,
      "cleanOverallCoefficient",
    ),
      cleanOverallCoefficient);
    (H.domain(
      Number.isFinite(fouledOverallCoefficient) && fouledOverallCoefficient > 0,
      "fouledOverallCoefficient",
    ),
      fouledOverallCoefficient);
    return (() => {
      const requiredFouledArea =
        cleanArea * (cleanOverallCoefficient / fouledOverallCoefficient);
      return {
        requiredFouledArea,
        areaIncrease: requiredFouledArea - cleanArea,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cleanArea: 10,
    cleanOverallCoefficient: 100,
    fouledOverallCoefficient: 80,
  },
  output: { requiredFouledArea: 12.5, areaIncrease: 2.5 },
} satisfies ToolExample<Input, Output>;
export const heatExchangerAreaFoulingAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/heat-exchanger-area-fouling-adjustment",
    title: "Heat Exchanger Area Fouling Adjustment",
    description:
      "Rescale supplied heat-exchanger area by clean-to-fouled overall coefficient ratio at fixed duty and driving temperature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cleanArea: { type: "number", minimum: 0 },
        cleanOverallCoefficient: { type: "number", exclusiveMinimum: 0 },
        fouledOverallCoefficient: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "cleanArea",
        "cleanOverallCoefficient",
        "fouledOverallCoefficient",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFouledArea: { type: "number" },
        areaIncrease: { type: "number" },
      },
      required: ["requiredFouledArea", "areaIncrease"],
    },
    ports: {
      inputs: [
        {
          id: "cleanArea",
          label: "Clean Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cleanOverallCoefficient",
          label: "Clean Overall Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fouledOverallCoefficient",
          label: "Fouled Overall Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredFouledArea",
          label: "Required Fouled Area",
          valueType: { type: "number" },
        },
        {
          id: "areaIncrease",
          label: "Area Increase",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = heatExchangerAreaFoulingAdjustmentTool.execute;
export default heatExchangerAreaFoulingAdjustmentTool;
