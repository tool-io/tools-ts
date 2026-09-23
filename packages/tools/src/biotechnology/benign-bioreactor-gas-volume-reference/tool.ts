import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly measuredPressure: number;
  readonly referencePressure: number;
  readonly measuredKelvin: number;
  readonly referenceKelvin: number;
};
export type Output = { readonly referenceVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    measuredPressure: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
    measuredKelvin: { type: "number", exclusiveMinimum: 0 },
    referenceKelvin: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "volume",
    "measuredPressure",
    "referencePressure",
    "measuredKelvin",
    "referenceKelvin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceVolume: { type: "number" } },
  required: ["referenceVolume"],
} as const;
/** Calculate benign bioreactor gas volume reference from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    volume,
    measuredPressure,
    referencePressure,
    measuredKelvin,
    referenceKelvin,
  } = request;
  const compute = (): Output => {
    H.domain(volume >= 0);
    H.positive(measuredPressure);
    H.positive(referencePressure);
    H.positive(measuredKelvin);
    H.positive(referenceKelvin);
    return {
      referenceVolume:
        (((volume * measuredPressure) / referencePressure) * referenceKelvin) /
        measuredKelvin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    volume: 10,
    measuredPressure: 200000,
    referencePressure: 100000,
    measuredKelvin: 300,
    referenceKelvin: 273,
  },
  output: { referenceVolume: 18.2 },
} satisfies ToolExample<Input, Output>;
export const benignBioreactorGasVolumeReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/benign-bioreactor-gas-volume-reference",
    title: "Benign Bioreactor Gas Volume Reference Tool",
    description:
      "Calculate benign bioreactor gas volume reference from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        measuredPressure: { type: "number", exclusiveMinimum: 0 },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
        measuredKelvin: { type: "number", exclusiveMinimum: 0 },
        referenceKelvin: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "volume",
        "measuredPressure",
        "referencePressure",
        "measuredKelvin",
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
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredPressure",
          label: "Measured Pressure",
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
          id: "measuredKelvin",
          label: "Measured Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceKelvin",
          label: "Reference Kelvin",
          required: true,
          valueType: { type: "number" },
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
export const run = benignBioreactorGasVolumeReferenceTool.execute;
export default benignBioreactorGasVolumeReferenceTool;
