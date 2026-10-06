import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wholeSampleCount: number;
  readonly subsampleCount: number;
};
export type Output = { readonly expansionFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeSampleCount: { type: "integer", minimum: 1 },
    subsampleCount: { type: "integer", minimum: 1 },
  },
  required: ["wholeSampleCount", "subsampleCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expansionFactor: { type: "number" } },
  required: ["expansionFactor"],
} as const;
/** Divide a supplied whole-sample count by its positive subsample count for a count-based expansion factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wholeSampleCount, subsampleCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(wholeSampleCount) &&
        wholeSampleCount >= 1 &&
        wholeSampleCount <= Number.MAX_SAFE_INTEGER,
      "wholeSampleCount",
    ),
      wholeSampleCount);
    (H.domain(
      Number.isSafeInteger(subsampleCount) &&
        subsampleCount >= 1 &&
        subsampleCount <= wholeSampleCount,
      "subsampleCount",
    ),
      subsampleCount);
    return { expansionFactor: wholeSampleCount / subsampleCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wholeSampleCount: 120, subsampleCount: 30 },
  output: { expansionFactor: 4 },
} satisfies ToolExample<Input, Output>;
export const fishSampleSubsamplingFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/fish-sample-subsampling-factor",
    title: "Fish Sample Subsampling Factor",
    description:
      "Divide a supplied whole-sample count by its positive subsample count for a count-based expansion factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeSampleCount: { type: "integer", minimum: 1 },
        subsampleCount: { type: "integer", minimum: 1 },
      },
      required: ["wholeSampleCount", "subsampleCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { expansionFactor: { type: "number" } },
      required: ["expansionFactor"],
    },
    ports: {
      inputs: [
        {
          id: "wholeSampleCount",
          label: "Whole Sample Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subsampleCount",
          label: "Subsample Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
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
export const run = fishSampleSubsamplingFactorTool.execute;
export default fishSampleSubsamplingFactorTool;
