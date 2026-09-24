import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gasVolume: number;
  readonly pressure: number;
  readonly temperatureKelvin: number;
  readonly referencePressure: number;
  readonly referenceKelvin: number;
};
export type Output = { readonly referenceVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gasVolume: { type: "number", minimum: 0 },
    pressure: { type: "number", exclusiveMinimum: 0 },
    temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
    referenceKelvin: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "gasVolume",
    "pressure",
    "temperatureKelvin",
    "referencePressure",
    "referenceKelvin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceVolume: { type: "number" } },
  required: ["referenceVolume"],
} as const;
/** Ideal-gas reference-volume crosswalk using absolute supplied pressures and temperatures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    gasVolume,
    pressure,
    temperatureKelvin,
    referencePressure,
    referenceKelvin,
  } = request;
  const compute = (): Output => {
    H.domain(gasVolume >= 0);
    H.positive(pressure);
    H.positive(temperatureKelvin);
    H.positive(referencePressure);
    H.positive(referenceKelvin);
    return {
      referenceVolume:
        gasVolume *
        (pressure / referencePressure) *
        (referenceKelvin / temperatureKelvin),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gasVolume: 10,
    pressure: 2,
    temperatureKelvin: 300,
    referencePressure: 1,
    referenceKelvin: 300,
  },
  output: { referenceVolume: 20 },
} satisfies ToolExample<Input, Output>;
export const boiloffGasBasisPressureFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/boiloff-gas-basis-pressure-factor",
    title: "Boiloff Gas Basis Pressure Factor Tool",
    description:
      "Ideal-gas reference-volume crosswalk using absolute supplied pressures and temperatures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gasVolume: { type: "number", minimum: 0 },
        pressure: { type: "number", exclusiveMinimum: 0 },
        temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
        referenceKelvin: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "gasVolume",
        "pressure",
        "temperatureKelvin",
        "referencePressure",
        "referenceKelvin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceVolume: { type: "number" } },
      required: ["referenceVolume"],
    },
    ports: {
      inputs: [
        {
          id: "gasVolume",
          label: "Gas Volume",
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
          id: "temperatureKelvin",
          label: "Temperature Kelvin",
          required: true,
          valueType: { type: "number", unit: "K" },
        },
        {
          id: "referencePressure",
          label: "Reference Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceKelvin",
          label: "Reference Kelvin",
          required: true,
          valueType: { type: "number", unit: "K" },
        },
      ],
      outputs: [
        {
          id: "referenceVolume",
          label: "Reference Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boiloffGasBasisPressureFactorTool.execute;
export default boiloffGasBasisPressureFactorTool;
