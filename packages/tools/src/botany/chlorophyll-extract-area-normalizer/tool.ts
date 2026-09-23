import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly extractConcentration: number;
  readonly extractVolume: number;
  readonly dilution: number;
  readonly sampledLeafArea: number;
};
export type Output = {
  readonly pigmentAmount: number;
  readonly pigmentPerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extractConcentration: { type: "number", minimum: 0 },
    extractVolume: { type: "number", minimum: 0 },
    dilution: { type: "number", exclusiveMinimum: 0 },
    sampledLeafArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "extractConcentration",
    "extractVolume",
    "dilution",
    "sampledLeafArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pigmentAmount: { type: "number" },
    pigmentPerArea: { type: "number" },
  },
  required: ["pigmentAmount", "pigmentPerArea"],
} as const;
/** Extracted pigment amount normalized by sampled leaf area in caller-consistent units, without a solvent/absorbance calibration equation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { extractConcentration, extractVolume, dilution, sampledLeafArea } =
    request;
  const compute = (): Output => {
    H.domain(extractConcentration >= 0 && extractVolume >= 0);
    H.positive(dilution);
    H.positive(sampledLeafArea);
    return {
      pigmentAmount: extractConcentration * extractVolume * dilution,
      pigmentPerArea:
        (extractConcentration * extractVolume * dilution) / sampledLeafArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    extractConcentration: 2,
    extractVolume: 10,
    dilution: 5,
    sampledLeafArea: 20,
  },
  output: { pigmentAmount: 100, pigmentPerArea: 5 },
} satisfies ToolExample<Input, Output>;
export const chlorophyllExtractAreaNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/chlorophyll-extract-area-normalizer",
    title: "Chlorophyll Extract Area Normalizer Tool",
    description:
      "Extracted pigment amount normalized by sampled leaf area in caller-consistent units, without a solvent/absorbance calibration equation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extractConcentration: { type: "number", minimum: 0 },
        extractVolume: { type: "number", minimum: 0 },
        dilution: { type: "number", exclusiveMinimum: 0 },
        sampledLeafArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "extractConcentration",
        "extractVolume",
        "dilution",
        "sampledLeafArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pigmentAmount: { type: "number" },
        pigmentPerArea: { type: "number" },
      },
      required: ["pigmentAmount", "pigmentPerArea"],
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
          id: "dilution",
          label: "Dilution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledLeafArea",
          label: "Sampled Leaf Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pigmentAmount",
          label: "Pigment Amount",
          valueType: { type: "number" },
        },
        {
          id: "pigmentPerArea",
          label: "Pigment Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chlorophyllExtractAreaNormalizerTool.execute;
export default chlorophyllExtractAreaNormalizerTool;
