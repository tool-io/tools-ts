import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperatureKelvin: number;
  readonly pressure: number;
  readonly referencePressure: number;
  readonly suppliedExponent: number;
};
export type Output = {
  readonly referenceRatio: number;
  readonly potentialTemperatureKelvin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
    pressure: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
    suppliedExponent: { type: "number" },
  },
  required: [
    "temperatureKelvin",
    "pressure",
    "referencePressure",
    "suppliedExponent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceRatio: { type: "number" },
    potentialTemperatureKelvin: { type: "number" },
  },
  required: ["referenceRatio", "potentialTemperatureKelvin"],
} as const;
/** Apply a supplied constant dry-adiabatic exponent and explicit reference pressure; no atmospheric profile is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperatureKelvin, pressure, referencePressure, suppliedExponent } =
    request;
  const compute = (): Output => {
    H.positive(temperatureKelvin);
    H.positive(pressure);
    H.positive(referencePressure);
    return {
      referenceRatio: (referencePressure / pressure) ** suppliedExponent,
      potentialTemperatureKelvin:
        temperatureKelvin * (referencePressure / pressure) ** suppliedExponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    temperatureKelvin: 300,
    pressure: 500,
    referencePressure: 1000,
    suppliedExponent: 1,
  },
  output: { referenceRatio: 2, potentialTemperatureKelvin: 600 },
} satisfies ToolExample<Input, Output>;
export const potentialTemperatureReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/potential-temperature-reference-ratio",
    title: "Potential Temperature Reference Ratio Tool",
    description:
      "Apply a supplied constant dry-adiabatic exponent and explicit reference pressure; no atmospheric profile is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
        pressure: { type: "number", exclusiveMinimum: 0 },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
        suppliedExponent: { type: "number" },
      },
      required: [
        "temperatureKelvin",
        "pressure",
        "referencePressure",
        "suppliedExponent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceRatio: { type: "number" },
        potentialTemperatureKelvin: { type: "number" },
      },
      required: ["referenceRatio", "potentialTemperatureKelvin"],
    },
    ports: {
      inputs: [
        {
          id: "temperatureKelvin",
          label: "Temperature Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pressure",
          label: "Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePressure",
          label: "Reference Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExponent",
          label: "Supplied Exponent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceRatio",
          label: "Reference Ratio",
          valueType: { type: "number" },
        },
        {
          id: "potentialTemperatureKelvin",
          label: "Potential Temperature Kelvin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = potentialTemperatureReferenceRatioTool.execute;
export default potentialTemperatureReferenceRatioTool;
