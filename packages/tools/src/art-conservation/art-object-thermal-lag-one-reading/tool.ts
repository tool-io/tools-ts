import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectTemperature: number;
  readonly airTemperature: number;
  readonly elapsedMinutes: number;
  readonly timeConstantMinutes: number;
};
export type Output = {
  readonly predictedTemperature: number;
  readonly retainedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectTemperature: { type: "number" },
    airTemperature: { type: "number" },
    elapsedMinutes: { type: "number", minimum: 0 },
    timeConstantMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "objectTemperature",
    "airTemperature",
    "elapsedMinutes",
    "timeConstantMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedTemperature: { type: "number" },
    retainedDifference: { type: "number" },
  },
  required: ["predictedTemperature", "retainedDifference"],
} as const;
/** Lumped first-order temperature response with an explicit constant air temperature and time constant. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    objectTemperature,
    airTemperature,
    elapsedMinutes,
    timeConstantMinutes,
  } = request;
  const compute = (): Output => {
    H.domain(elapsedMinutes >= 0);
    H.positive(timeConstantMinutes);
    return {
      predictedTemperature:
        airTemperature +
        (objectTemperature - airTemperature) *
          Math.exp(-elapsedMinutes / timeConstantMinutes),
      retainedDifference:
        (objectTemperature - airTemperature) *
        Math.exp(-elapsedMinutes / timeConstantMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    objectTemperature: 10,
    airTemperature: 20,
    elapsedMinutes: 0,
    timeConstantMinutes: 30,
  },
  output: { predictedTemperature: 10, retainedDifference: -10 },
} satisfies ToolExample<Input, Output>;
export const artObjectThermalLagOneReadingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/art-object-thermal-lag-one-reading",
    title: "Art Object Thermal Lag One Reading Tool",
    description:
      "Lumped first-order temperature response with an explicit constant air temperature and time constant.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectTemperature: { type: "number" },
        airTemperature: { type: "number" },
        elapsedMinutes: { type: "number", minimum: 0 },
        timeConstantMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "objectTemperature",
        "airTemperature",
        "elapsedMinutes",
        "timeConstantMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedTemperature: { type: "number" },
        retainedDifference: { type: "number" },
      },
      required: ["predictedTemperature", "retainedDifference"],
    },
    ports: {
      inputs: [
        {
          id: "objectTemperature",
          label: "Object Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "airTemperature",
          label: "Air Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "timeConstantMinutes",
          label: "Time Constant Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "predictedTemperature",
          label: "Predicted Temperature",
          valueType: { type: "number" },
        },
        {
          id: "retainedDifference",
          label: "Retained Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artObjectThermalLagOneReadingTool.execute;
export default artObjectThermalLagOneReadingTool;
