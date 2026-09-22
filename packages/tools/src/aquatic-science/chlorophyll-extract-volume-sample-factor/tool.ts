import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly extractConcentration: number;
  readonly extractVolume: number;
  readonly sampleVolume: number;
  readonly dilution: number;
  readonly blankConcentration: number;
};
export type Output = {
  readonly netExtractConcentration: number;
  readonly sampleConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extractConcentration: { type: "number", minimum: 0 },
    extractVolume: { type: "number", minimum: 0 },
    sampleVolume: { type: "number", exclusiveMinimum: 0 },
    dilution: { type: "number", exclusiveMinimum: 0 },
    blankConcentration: { type: "number", minimum: 0 },
  },
  required: [
    "extractConcentration",
    "extractVolume",
    "sampleVolume",
    "dilution",
    "blankConcentration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netExtractConcentration: { type: "number" },
    sampleConcentration: { type: "number" },
  },
  required: ["netExtractConcentration", "sampleConcentration"],
} as const;
/** Common-volume-unit extraction balance with an explicit dilution factor; signed blank-corrected results are retained. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    extractConcentration,
    extractVolume,
    sampleVolume,
    dilution,
    blankConcentration,
  } = request;
  const compute = (): Output => {
    H.domain(
      extractConcentration >= 0 &&
        blankConcentration >= 0 &&
        extractVolume >= 0,
    );
    H.positive(sampleVolume);
    H.positive(dilution);
    return {
      netExtractConcentration: extractConcentration - blankConcentration,
      sampleConcentration:
        ((extractConcentration - blankConcentration) *
          extractVolume *
          dilution) /
        sampleVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    extractConcentration: 10,
    extractVolume: 0.02,
    sampleVolume: 2,
    dilution: 2,
    blankConcentration: 1,
  },
  output: { netExtractConcentration: 9, sampleConcentration: 0.18 },
} satisfies ToolExample<Input, Output>;
export const chlorophyllExtractVolumeSampleFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquatic-science/chlorophyll-extract-volume-sample-factor",
      title: "Chlorophyll Extract Volume Sample Factor Tool",
      description:
        "Common-volume-unit extraction balance with an explicit dilution factor; signed blank-corrected results are retained.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          extractConcentration: { type: "number", minimum: 0 },
          extractVolume: { type: "number", minimum: 0 },
          sampleVolume: { type: "number", exclusiveMinimum: 0 },
          dilution: { type: "number", exclusiveMinimum: 0 },
          blankConcentration: { type: "number", minimum: 0 },
        },
        required: [
          "extractConcentration",
          "extractVolume",
          "sampleVolume",
          "dilution",
          "blankConcentration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netExtractConcentration: { type: "number" },
          sampleConcentration: { type: "number" },
        },
        required: ["netExtractConcentration", "sampleConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "extractConcentration",
            label: "Extract Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "extractVolume",
            label: "Extract Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sampleVolume",
            label: "Sample Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dilution",
            label: "Dilution",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blankConcentration",
            label: "Blank Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netExtractConcentration",
            label: "Net Extract Concentration",
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
export const run = chlorophyllExtractVolumeSampleFactorTool.execute;
export default chlorophyllExtractVolumeSampleFactorTool;
