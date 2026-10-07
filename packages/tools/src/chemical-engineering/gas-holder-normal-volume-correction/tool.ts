import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredVolume: number;
  readonly measuredAbsolutePressure: number;
  readonly referenceAbsolutePressure: number;
  readonly measuredKelvin: number;
  readonly referenceKelvin: number;
};
export type Output = { readonly referenceVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredVolume: { type: "number", minimum: 0 },
    measuredAbsolutePressure: { type: "number", exclusiveMinimum: 0 },
    referenceAbsolutePressure: { type: "number", exclusiveMinimum: 0 },
    measuredKelvin: { type: "number", exclusiveMinimum: 0 },
    referenceKelvin: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "measuredVolume",
    "measuredAbsolutePressure",
    "referenceAbsolutePressure",
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
/** Convert supplied ideal dry-gas volume to explicit reference absolute pressure and temperature without inferring normal-condition conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredVolume,
    measuredAbsolutePressure,
    referenceAbsolutePressure,
    measuredKelvin,
    referenceKelvin,
  } = request;
  const compute = (): Output => {
    H.domain(measuredVolume >= 0, "measuredVolume");
    (H.domain(
      Number.isFinite(measuredAbsolutePressure) && measuredAbsolutePressure > 0,
      "measuredAbsolutePressure",
    ),
      measuredAbsolutePressure);
    (H.domain(
      Number.isFinite(referenceAbsolutePressure) &&
        referenceAbsolutePressure > 0,
      "referenceAbsolutePressure",
    ),
      referenceAbsolutePressure);
    (H.domain(
      Number.isFinite(measuredKelvin) && measuredKelvin > 0,
      "measuredKelvin",
    ),
      measuredKelvin);
    (H.domain(
      Number.isFinite(referenceKelvin) && referenceKelvin > 0,
      "referenceKelvin",
    ),
      referenceKelvin);
    return {
      referenceVolume:
        measuredVolume *
        (measuredAbsolutePressure / referenceAbsolutePressure) *
        (referenceKelvin / measuredKelvin),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredVolume: 10,
    measuredAbsolutePressure: 200,
    referenceAbsolutePressure: 100,
    measuredKelvin: 300,
    referenceKelvin: 300,
  },
  output: { referenceVolume: 20 },
} satisfies ToolExample<Input, Output>;
export const gasHolderNormalVolumeCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["chemical-engineering", "chemical engineering", "engineering"],
      keywords: ["chemical engineering", "engineering"],
    },
    id: "chemical-engineering/gas-holder-normal-volume-correction",
    title: "Gas Holder Normal Volume Correction",
    description:
      "Convert supplied ideal dry-gas volume to explicit reference absolute pressure and temperature without inferring normal-condition conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredVolume: { type: "number", minimum: 0 },
        measuredAbsolutePressure: { type: "number", exclusiveMinimum: 0 },
        referenceAbsolutePressure: { type: "number", exclusiveMinimum: 0 },
        measuredKelvin: { type: "number", exclusiveMinimum: 0 },
        referenceKelvin: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "measuredVolume",
        "measuredAbsolutePressure",
        "referenceAbsolutePressure",
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
          id: "measuredVolume",
          label: "Measured Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredAbsolutePressure",
          label: "Measured Absolute Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAbsolutePressure",
          label: "Reference Absolute Pressure",
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
export const run = gasHolderNormalVolumeCorrectionTool.execute;
export default gasHolderNormalVolumeCorrectionTool;
