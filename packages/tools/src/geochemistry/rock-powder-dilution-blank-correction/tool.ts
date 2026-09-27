import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredConcentration: number;
  readonly blankConcentration: number;
  readonly dilutionFactor: number;
  readonly digestVolume: number;
  readonly sampleMass: number;
};
export type Output = {
  readonly blankCorrected: number;
  readonly sampleConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredConcentration: { type: "number" },
    blankConcentration: { type: "number" },
    dilutionFactor: { type: "number", exclusiveMinimum: 0 },
    digestVolume: { type: "number", exclusiveMinimum: 0 },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "measuredConcentration",
    "blankConcentration",
    "dilutionFactor",
    "digestVolume",
    "sampleMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankCorrected: { type: "number" },
    sampleConcentration: { type: "number" },
  },
  required: ["blankCorrected", "sampleConcentration"],
} as const;
/** Blank-corrected digest concentration converted to sample mass basis in caller-consistent units; negative blanks-corrected results are retained. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredConcentration,
    blankConcentration,
    dilutionFactor,
    digestVolume,
    sampleMass,
  } = request;
  const compute = (): Output => {
    H.positive(dilutionFactor);
    H.positive(digestVolume);
    H.positive(sampleMass);
    return {
      blankCorrected: measuredConcentration - blankConcentration,
      sampleConcentration:
        ((measuredConcentration - blankConcentration) *
          dilutionFactor *
          digestVolume) /
        sampleMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredConcentration: 12,
    blankConcentration: 2,
    dilutionFactor: 5,
    digestVolume: 0.1,
    sampleMass: 0.01,
  },
  output: { blankCorrected: 10, sampleConcentration: 500 },
} satisfies ToolExample<Input, Output>;
export const rockPowderDilutionBlankCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/rock-powder-dilution-blank-correction",
    title: "Rock Powder Dilution Blank Correction Tool",
    description:
      "Blank-corrected digest concentration converted to sample mass basis in caller-consistent units; negative blanks-corrected results are retained.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredConcentration: { type: "number" },
        blankConcentration: { type: "number" },
        dilutionFactor: { type: "number", exclusiveMinimum: 0 },
        digestVolume: { type: "number", exclusiveMinimum: 0 },
        sampleMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "measuredConcentration",
        "blankConcentration",
        "dilutionFactor",
        "digestVolume",
        "sampleMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blankCorrected: { type: "number" },
        sampleConcentration: { type: "number" },
      },
      required: ["blankCorrected", "sampleConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "measuredConcentration",
          label: "Measured Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankConcentration",
          label: "Blank Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "digestVolume",
          label: "Digest Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "blankCorrected",
          label: "Blank Corrected",
          valueType: { type: "number" },
        },
        {
          id: "sampleConcentration",
          label: "Sample Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rockPowderDilutionBlankCorrectionTool.execute;
export default rockPowderDilutionBlankCorrectionTool;
