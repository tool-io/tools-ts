import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly epochSample: number;
  readonly referenceSample: number;
  readonly sampleRateHz: number;
};
export type Output = {
  readonly sampleGapDecimal: string;
  readonly seconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    epochSample: { type: "integer", minimum: 0 },
    referenceSample: { type: "integer", minimum: 0 },
    sampleRateHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["epochSample", "referenceSample", "sampleRateHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleGapDecimal: { type: "string", maxLength: 8192 },
    seconds: { type: "number" },
  },
  required: ["sampleGapDecimal", "seconds"],
} as const;
/** Compare supplied research EEG sample indices under a declared common clock. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { epochSample, referenceSample, sampleRateHz } = request;
  const compute = (): Output => {
    H.integer(epochSample, 0);
    H.integer(referenceSample, 0);
    H.positive(sampleRateHz);
    return {
      sampleGapDecimal: (
        BigInt(epochSample) - BigInt(referenceSample)
      ).toString(),
      seconds:
        Number(BigInt(epochSample) - BigInt(referenceSample)) / sampleRateHz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { epochSample: 1250, referenceSample: 1000, sampleRateHz: 250 },
  output: { sampleGapDecimal: "250", seconds: 1 },
} satisfies ToolExample<Input, Output>;
export const eegEpochSampleOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-epoch-sample-origin-gap",
    title: "EEG Epoch Sample Origin Gap Tool",
    description:
      "Compare supplied research EEG sample indices under a declared common clock.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        epochSample: { type: "integer", minimum: 0 },
        referenceSample: { type: "integer", minimum: 0 },
        sampleRateHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["epochSample", "referenceSample", "sampleRateHz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleGapDecimal: { type: "string", maxLength: 8192 },
        seconds: { type: "number" },
      },
      required: ["sampleGapDecimal", "seconds"],
    },
    ports: {
      inputs: [
        {
          id: "epochSample",
          label: "Epoch Sample",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceSample",
          label: "Reference Sample",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleRateHz",
          label: "Sample Rate Hz",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampleGapDecimal",
          label: "Sample Gap Decimal",
          valueType: { type: "string" },
        },
        { id: "seconds", label: "Seconds", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eegEpochSampleOriginGapTool.execute;
export default eegEpochSampleOriginGapTool;
