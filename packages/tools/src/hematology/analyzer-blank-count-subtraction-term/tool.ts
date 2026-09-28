import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleCount: number;
  readonly blankCount: number;
  readonly sampleExposure: number;
  readonly blankExposure: number;
};
export type Output = {
  readonly scaledBlank: number;
  readonly correctedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleCount: { type: "number", minimum: 0 },
    blankCount: { type: "number", minimum: 0 },
    sampleExposure: { type: "number", exclusiveMinimum: 0 },
    blankExposure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleCount", "blankCount", "sampleExposure", "blankExposure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaledBlank: { type: "number" },
    correctedCount: { type: "number" },
  },
  required: ["scaledBlank", "correctedCount"],
} as const;
/** Exposure-scaled blank subtraction retains signed corrected counts and does not infer detection or diagnostic limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleCount, blankCount, sampleExposure, blankExposure } = request;
  const compute = (): Output => {
    H.domain(sampleCount >= 0 && blankCount >= 0);
    H.positive(sampleExposure);
    H.positive(blankExposure);
    return {
      scaledBlank: (blankCount * sampleExposure) / blankExposure,
      correctedCount:
        sampleCount - (blankCount * sampleExposure) / blankExposure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleCount: 100,
    blankCount: 10,
    sampleExposure: 2,
    blankExposure: 1,
  },
  output: { scaledBlank: 20, correctedCount: 80 },
} satisfies ToolExample<Input, Output>;
export const analyzerBlankCountSubtractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/analyzer-blank-count-subtraction-term",
    title: "Analyzer Blank Count Subtraction Term Tool",
    description:
      "Exposure-scaled blank subtraction retains signed corrected counts and does not infer detection or diagnostic limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleCount: { type: "number", minimum: 0 },
        blankCount: { type: "number", minimum: 0 },
        sampleExposure: { type: "number", exclusiveMinimum: 0 },
        blankExposure: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "sampleCount",
        "blankCount",
        "sampleExposure",
        "blankExposure",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaledBlank: { type: "number" },
        correctedCount: { type: "number" },
      },
      required: ["scaledBlank", "correctedCount"],
    },
    ports: {
      inputs: [
        {
          id: "sampleCount",
          label: "Sample Count",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankCount",
          label: "Blank Count",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleExposure",
          label: "Sample Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankExposure",
          label: "Blank Exposure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledBlank",
          label: "Scaled Blank",
          valueType: { type: "number" },
        },
        {
          id: "correctedCount",
          label: "Corrected Count",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = analyzerBlankCountSubtractionTermTool.execute;
export default analyzerBlankCountSubtractionTermTool;
