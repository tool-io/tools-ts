import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blockArea: number;
  readonly sampledArea: number;
  readonly overlapArea: number;
  readonly secondSampleArea: number;
};
export type Output = {
  readonly sampledUnion: number;
  readonly sampledShare: number;
  readonly remainingArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockArea: { type: "number", exclusiveMinimum: 0 },
    sampledArea: { type: "number", minimum: 0 },
    overlapArea: { type: "number", minimum: 0 },
    secondSampleArea: { type: "number", minimum: 0 },
  },
  required: ["blockArea", "sampledArea", "overlapArea", "secondSampleArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampledUnion: { type: "number" },
    sampledShare: { type: "number" },
    remainingArea: { type: "number" },
  },
  required: ["sampledUnion", "sampledShare", "remainingArea"],
} as const;
/** Calculate tissue block sampling area share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blockArea, sampledArea, overlapArea, secondSampleArea } = request;
  const compute = (): Output => {
    H.positive(blockArea);
    H.domain(
      sampledArea >= 0 &&
        secondSampleArea >= 0 &&
        overlapArea >= 0 &&
        overlapArea <= Math.min(sampledArea, secondSampleArea) &&
        sampledArea + secondSampleArea - overlapArea <= blockArea,
    );
    return {
      sampledUnion: sampledArea + secondSampleArea - overlapArea,
      sampledShare: (sampledArea + secondSampleArea - overlapArea) / blockArea,
      remainingArea: blockArea - sampledArea - secondSampleArea + overlapArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    blockArea: 100,
    sampledArea: 20,
    overlapArea: 5,
    secondSampleArea: 15,
  },
  output: { sampledUnion: 30, sampledShare: 0.3, remainingArea: 70 },
} satisfies ToolExample<Input, Output>;
export const tissueBlockSamplingAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/tissue-block-sampling-area-share",
    title: "Tissue Block Sampling Area Share Tool",
    description:
      "Calculate tissue block sampling area share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockArea: { type: "number", exclusiveMinimum: 0 },
        sampledArea: { type: "number", minimum: 0 },
        overlapArea: { type: "number", minimum: 0 },
        secondSampleArea: { type: "number", minimum: 0 },
      },
      required: ["blockArea", "sampledArea", "overlapArea", "secondSampleArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampledUnion: { type: "number" },
        sampledShare: { type: "number" },
        remainingArea: { type: "number" },
      },
      required: ["sampledUnion", "sampledShare", "remainingArea"],
    },
    ports: {
      inputs: [
        {
          id: "blockArea",
          label: "Block Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledArea",
          label: "Sampled Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapArea",
          label: "Overlap Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondSampleArea",
          label: "Second Sample Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampledUnion",
          label: "Sampled Union",
          valueType: { type: "number" },
        },
        {
          id: "sampledShare",
          label: "Sampled Share",
          valueType: { type: "number" },
        },
        {
          id: "remainingArea",
          label: "Remaining Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueBlockSamplingAreaShareTool.execute;
export default tissueBlockSamplingAreaShareTool;
