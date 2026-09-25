import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualVolume: number;
  readonly actualPressure: number;
  readonly actualTemperatureK: number;
  readonly referencePressure: number;
  readonly referenceTemperatureK: number;
};
export type Output = {
  readonly referenceVolume: number;
  readonly expansionFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualVolume: { type: "number", minimum: 0 },
    actualPressure: { type: "number", exclusiveMinimum: 0 },
    actualTemperatureK: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
    referenceTemperatureK: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "actualVolume",
    "actualPressure",
    "actualTemperatureK",
    "referencePressure",
    "referenceTemperatureK",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceVolume: { type: "number" },
    expansionFactor: { type: "number" },
  },
  required: ["referenceVolume", "expansionFactor"],
} as const;
/** Ideal-gas reference-volume conversion without vent sizing, oxygen-displacement or pressure-safety conclusions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    actualVolume,
    actualPressure,
    actualTemperatureK,
    referencePressure,
    referenceTemperatureK,
  } = request;
  const compute = (): Output => {
    H.domain(actualVolume >= 0);
    H.positive(actualPressure);
    H.positive(actualTemperatureK);
    H.positive(referencePressure);
    H.positive(referenceTemperatureK);
    return {
      referenceVolume:
        (actualVolume * actualPressure * referenceTemperatureK) /
        (referencePressure * actualTemperatureK),
      expansionFactor:
        (actualPressure * referenceTemperatureK) /
        (referencePressure * actualTemperatureK),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    actualVolume: 10,
    actualPressure: 100000,
    actualTemperatureK: 100,
    referencePressure: 100000,
    referenceTemperatureK: 300,
  },
  output: { referenceVolume: 30, expansionFactor: 3 },
} satisfies ToolExample<Input, Output>;
export const cryogenVentVolumeReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cryogen-vent-volume-reference-factor",
    title: "Cryogen Vent Volume Reference Factor Tool",
    description:
      "Ideal-gas reference-volume conversion without vent sizing, oxygen-displacement or pressure-safety conclusions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualVolume: { type: "number", minimum: 0 },
        actualPressure: { type: "number", exclusiveMinimum: 0 },
        actualTemperatureK: { type: "number", exclusiveMinimum: 0 },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
        referenceTemperatureK: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "actualVolume",
        "actualPressure",
        "actualTemperatureK",
        "referencePressure",
        "referenceTemperatureK",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceVolume: { type: "number" },
        expansionFactor: { type: "number" },
      },
      required: ["referenceVolume", "expansionFactor"],
    },
    ports: {
      inputs: [
        {
          id: "actualVolume",
          label: "Actual Volume",
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
          id: "actualTemperatureK",
          label: "Actual Temperature K",
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
          id: "referenceTemperatureK",
          label: "Reference Temperature K",
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
        {
          id: "expansionFactor",
          label: "Expansion Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cryogenVentVolumeReferenceFactorTool.execute;
export default cryogenVentVolumeReferenceFactorTool;
