import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceResistance: number;
  readonly temperatureCoefficient: number;
  readonly referenceTemperature: number;
  readonly junctionTemperature: number;
};
export type Output = {
  readonly resistance: number;
  readonly derivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceResistance: { type: "number", exclusiveMinimum: 0 },
    temperatureCoefficient: { type: "number" },
    referenceTemperature: { type: "number" },
    junctionTemperature: { type: "number" },
  },
  required: [
    "referenceResistance",
    "temperatureCoefficient",
    "referenceTemperature",
    "junctionTemperature",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistance: { type: "number" },
    derivative: { type: "number" },
  },
  required: ["resistance", "derivative"],
} as const;
/** First-order supplied linear resistance model and its temperature derivative. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    referenceResistance,
    temperatureCoefficient,
    referenceTemperature,
    junctionTemperature,
  } = request;
  const compute = (): Output => {
    H.positive(referenceResistance);
    H.domain(
      1 +
        temperatureCoefficient * (junctionTemperature - referenceTemperature) >
        0,
    );
    return {
      resistance:
        referenceResistance *
        (1 +
          temperatureCoefficient *
            (junctionTemperature - referenceTemperature)),
      derivative: referenceResistance * temperatureCoefficient,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceResistance: 100,
    temperatureCoefficient: 0.01,
    referenceTemperature: 20,
    junctionTemperature: 30,
  },
  output: { resistance: 110.00000000000001, derivative: 1 },
} satisfies ToolExample<Input, Output>;
export const resistorJunctionTemperatureSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/resistor-junction-temperature-sensitivity",
      title: "Resistor Junction Temperature Sensitivity Tool",
      description:
        "First-order supplied linear resistance model and its temperature derivative.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceResistance: { type: "number", exclusiveMinimum: 0 },
          temperatureCoefficient: { type: "number" },
          referenceTemperature: { type: "number" },
          junctionTemperature: { type: "number" },
        },
        required: [
          "referenceResistance",
          "temperatureCoefficient",
          "referenceTemperature",
          "junctionTemperature",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resistance: { type: "number" },
          derivative: { type: "number" },
        },
        required: ["resistance", "derivative"],
      },
      ports: {
        inputs: [
          {
            id: "referenceResistance",
            label: "Reference Resistance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperatureCoefficient",
            label: "Temperature Coefficient",
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
            id: "junctionTemperature",
            label: "Junction Temperature",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "resistance",
            label: "Resistance",
            valueType: { type: "number" },
          },
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = resistorJunctionTemperatureSensitivityTool.execute;
export default resistorJunctionTemperatureSensitivityTool;
