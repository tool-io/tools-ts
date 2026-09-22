import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualTemperature: number;
  readonly standardTemperature: number;
  readonly actualPressure: number;
  readonly standardPressure: number;
};
export type Output = { readonly standardToActualVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualTemperature: { type: "number", exclusiveMinimum: 0 },
    standardTemperature: { type: "number", exclusiveMinimum: 0 },
    actualPressure: { type: "number", exclusiveMinimum: 0 },
    standardPressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "actualTemperature",
    "standardTemperature",
    "actualPressure",
    "standardPressure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standardToActualVolume: { type: "number" } },
  required: ["standardToActualVolume"],
} as const;
/** Compare same-amount ideal-gas volumes using supplied absolute temperatures and pressures, without fixed standard conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    actualTemperature,
    standardTemperature,
    actualPressure,
    standardPressure,
  } = request;
  const compute = (): Output => {
    H.positive(actualTemperature);
    H.positive(standardTemperature);
    H.positive(actualPressure);
    H.positive(standardPressure);
    return {
      standardToActualVolume:
        (standardTemperature / actualTemperature) *
        (actualPressure / standardPressure),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    actualTemperature: 300,
    standardTemperature: 250,
    actualPressure: 100,
    standardPressure: 100,
  },
  output: { standardToActualVolume: 0.8333333333333334 },
} satisfies ToolExample<Input, Output>;
export const standardFlowVolumeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/standard-flow-volume-ratio",
    title: "Standard Flow Volume Ratio Tool",
    description:
      "Compare same-amount ideal-gas volumes using supplied absolute temperatures and pressures, without fixed standard conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualTemperature: { type: "number", exclusiveMinimum: 0 },
        standardTemperature: { type: "number", exclusiveMinimum: 0 },
        actualPressure: { type: "number", exclusiveMinimum: 0 },
        standardPressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "actualTemperature",
        "standardTemperature",
        "actualPressure",
        "standardPressure",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { standardToActualVolume: { type: "number" } },
      required: ["standardToActualVolume"],
    },
    ports: {
      inputs: [
        {
          id: "actualTemperature",
          label: "Actual Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standardTemperature",
          label: "Standard Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualPressure",
          label: "Actual Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standardPressure",
          label: "Standard Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "standardToActualVolume",
          label: "Standard To Actual Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = standardFlowVolumeRatioTool.execute;
export default standardFlowVolumeRatioTool;
