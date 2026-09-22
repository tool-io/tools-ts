import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly referenceOffset: number;
  readonly temperature: number;
  readonly referenceTemperature: number;
  readonly offsetPerDegree: number;
};
export type Output = { readonly offset: number; readonly corrected: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    referenceOffset: { type: "number" },
    temperature: { type: "number" },
    referenceTemperature: { type: "number" },
    offsetPerDegree: { type: "number" },
  },
  required: [
    "measured",
    "referenceOffset",
    "temperature",
    "referenceTemperature",
    "offsetPerDegree",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" }, corrected: { type: "number" } },
  required: ["offset", "corrected"],
} as const;
/** Subtract a caller-calibrated additive linear temperature offset on a common temperature-difference scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measured,
    referenceOffset,
    temperature,
    referenceTemperature,
    offsetPerDegree,
  } = request;
  const compute = (): Output => {
    return {
      offset:
        referenceOffset +
        (temperature - referenceTemperature) * offsetPerDegree,
      corrected:
        measured -
        referenceOffset -
        (temperature - referenceTemperature) * offsetPerDegree,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measured: 10,
    referenceOffset: 1,
    temperature: 30,
    referenceTemperature: 20,
    offsetPerDegree: 0.1,
  },
  output: { offset: 2, corrected: 8 },
} satisfies ToolExample<Input, Output>;
export const benchSensorOffsetTemperatureTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/bench-sensor-offset-temperature-term",
    title: "Bench Sensor Offset Temperature Term Tool",
    description:
      "Subtract a caller-calibrated additive linear temperature offset on a common temperature-difference scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number" },
        referenceOffset: { type: "number" },
        temperature: { type: "number" },
        referenceTemperature: { type: "number" },
        offsetPerDegree: { type: "number" },
      },
      required: [
        "measured",
        "referenceOffset",
        "temperature",
        "referenceTemperature",
        "offsetPerDegree",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" }, corrected: { type: "number" } },
      required: ["offset", "corrected"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceOffset",
          label: "Reference Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTemperature",
          label: "Reference Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetPerDegree",
          label: "Offset Per Degree",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = benchSensorOffsetTemperatureTermTool.execute;
export default benchSensorOffsetTemperatureTermTool;
