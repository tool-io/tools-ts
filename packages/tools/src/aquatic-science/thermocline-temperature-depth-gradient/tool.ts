import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upperTemperature: number;
  readonly lowerTemperature: number;
  readonly upperDepth: number;
  readonly lowerDepth: number;
};
export type Output = {
  readonly gradient: number;
  readonly temperatureDrop: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upperTemperature: { type: "number" },
    lowerTemperature: { type: "number" },
    upperDepth: { type: "number" },
    lowerDepth: { type: "number" },
  },
  required: [
    "upperTemperature",
    "lowerTemperature",
    "upperDepth",
    "lowerDepth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradient: { type: "number" },
    temperatureDrop: { type: "number" },
  },
  required: ["gradient", "temperatureDrop"],
} as const;
/** Depth increases downward; no automatic thermocline detection is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upperTemperature, lowerTemperature, upperDepth, lowerDepth } =
    request;
  const compute = (): Output => {
    H.domain(lowerDepth > upperDepth);
    return {
      gradient:
        (lowerTemperature - upperTemperature) / (lowerDepth - upperDepth),
      temperatureDrop: upperTemperature - lowerTemperature,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    upperTemperature: 20,
    lowerTemperature: 10,
    upperDepth: 2,
    lowerDepth: 7,
  },
  output: { gradient: -2, temperatureDrop: 10 },
} satisfies ToolExample<Input, Output>;
export const thermoclineTemperatureDepthGradientTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquatic-science/thermocline-temperature-depth-gradient",
      title: "Thermocline Temperature Depth Gradient Tool",
      description:
        "Depth increases downward; no automatic thermocline detection is performed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          upperTemperature: { type: "number" },
          lowerTemperature: { type: "number" },
          upperDepth: { type: "number" },
          lowerDepth: { type: "number" },
        },
        required: [
          "upperTemperature",
          "lowerTemperature",
          "upperDepth",
          "lowerDepth",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gradient: { type: "number" },
          temperatureDrop: { type: "number" },
        },
        required: ["gradient", "temperatureDrop"],
      },
      ports: {
        inputs: [
          {
            id: "upperTemperature",
            label: "Upper Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerTemperature",
            label: "Lower Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperDepth",
            label: "Upper Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerDepth",
            label: "Lower Depth",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "gradient", label: "Gradient", valueType: { type: "number" } },
          {
            id: "temperatureDrop",
            label: "Temperature Drop",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = thermoclineTemperatureDepthGradientTool.execute;
export default thermoclineTemperatureDepthGradientTool;
