import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gasVolume: number;
  readonly gasPressure: number;
  readonly gasTemperatureKelvin: number;
  readonly referencePressure: number;
  readonly referenceTemperatureKelvin: number;
  readonly beverageVolume: number;
};
export type Output = {
  readonly referenceGasVolume: number;
  readonly carbonationVolumes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gasVolume: { type: "number", minimum: 0 },
    gasPressure: { type: "number", exclusiveMinimum: 0 },
    gasTemperatureKelvin: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
    referenceTemperatureKelvin: { type: "number", exclusiveMinimum: 0 },
    beverageVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "gasVolume",
    "gasPressure",
    "gasTemperatureKelvin",
    "referencePressure",
    "referenceTemperatureKelvin",
    "beverageVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceGasVolume: { type: "number" },
    carbonationVolumes: { type: "number" },
  },
  required: ["referenceGasVolume", "carbonationVolumes"],
} as const;
/** Ideal-gas reference-volume conversion using absolute supplied pressures and temperatures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    gasVolume,
    gasPressure,
    gasTemperatureKelvin,
    referencePressure,
    referenceTemperatureKelvin,
    beverageVolume,
  } = request;
  const compute = (): Output => {
    H.domain(gasVolume >= 0);
    H.positive(gasPressure);
    H.positive(gasTemperatureKelvin);
    H.positive(referencePressure);
    H.positive(referenceTemperatureKelvin);
    H.positive(beverageVolume);
    return {
      referenceGasVolume:
        gasVolume *
        (gasPressure / referencePressure) *
        (referenceTemperatureKelvin / gasTemperatureKelvin),
      carbonationVolumes:
        (gasVolume *
          (gasPressure / referencePressure) *
          (referenceTemperatureKelvin / gasTemperatureKelvin)) /
        beverageVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gasVolume: 2,
    gasPressure: 2,
    gasTemperatureKelvin: 300,
    referencePressure: 1,
    referenceTemperatureKelvin: 300,
    beverageVolume: 1,
  },
  output: { referenceGasVolume: 4, carbonationVolumes: 4 },
} satisfies ToolExample<Input, Output>;
export const beverageCarbonationGasVolumeReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-technology/beverage-carbonation-gas-volume-reference",
      title: "Beverage Carbonation Gas Volume Reference Tool",
      description:
        "Ideal-gas reference-volume conversion using absolute supplied pressures and temperatures.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gasVolume: { type: "number", minimum: 0 },
          gasPressure: { type: "number", exclusiveMinimum: 0 },
          gasTemperatureKelvin: { type: "number", exclusiveMinimum: 0 },
          referencePressure: { type: "number", exclusiveMinimum: 0 },
          referenceTemperatureKelvin: { type: "number", exclusiveMinimum: 0 },
          beverageVolume: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "gasVolume",
          "gasPressure",
          "gasTemperatureKelvin",
          "referencePressure",
          "referenceTemperatureKelvin",
          "beverageVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceGasVolume: { type: "number" },
          carbonationVolumes: { type: "number" },
        },
        required: ["referenceGasVolume", "carbonationVolumes"],
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
            id: "gasPressure",
            label: "Gas Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gasTemperatureKelvin",
            label: "Gas Temperature Kelvin",
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
            id: "referenceTemperatureKelvin",
            label: "Reference Temperature Kelvin",
            required: true,
            valueType: { type: "number", unit: "K" },
          },
          {
            id: "beverageVolume",
            label: "Beverage Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "referenceGasVolume",
            label: "Reference Gas Volume",
            valueType: { type: "number" },
          },
          {
            id: "carbonationVolumes",
            label: "Carbonation Volumes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = beverageCarbonationGasVolumeReferenceTool.execute;
export default beverageCarbonationGasVolumeReferenceTool;
