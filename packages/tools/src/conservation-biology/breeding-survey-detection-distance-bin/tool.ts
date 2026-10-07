import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly lowerInclusive: number;
  readonly upperExclusive: number;
};
export type Output = { readonly inBin: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    lowerInclusive: { type: "number", minimum: 0 },
    upperExclusive: { type: "number" },
  },
  required: ["distance", "lowerInclusive", "upperExclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inBin: { type: "boolean" } },
  required: ["inBin"],
} as const;
/** Check a supplied nonnegative breeding-survey distance against explicit half-open distance-bin limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, lowerInclusive, upperExclusive } = request;
  const compute = (): Output => {
    H.domain(distance >= 0, "distance");
    H.domain(lowerInclusive >= 0, "lowerInclusive");
    H.domain(upperExclusive > lowerInclusive, "upperExclusive");
    return { inBin: distance >= lowerInclusive && distance < upperExclusive };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 25, lowerInclusive: 20, upperExclusive: 30 },
  output: { inBin: true },
} satisfies ToolExample<Input, Output>;
export const breedingSurveyDetectionDistanceBinTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/breeding-survey-detection-distance-bin",
    title: "Breeding Survey Detection Distance Bin",
    description:
      "Check a supplied nonnegative breeding-survey distance against explicit half-open distance-bin limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        lowerInclusive: { type: "number", minimum: 0 },
        upperExclusive: { type: "number" },
      },
      required: ["distance", "lowerInclusive", "upperExclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inBin: { type: "boolean" } },
      required: ["inBin"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerInclusive",
          label: "Lower Inclusive",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperExclusive",
          label: "Upper Exclusive",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "inBin", label: "In Bin", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = breedingSurveyDetectionDistanceBinTool.execute;
export default breedingSurveyDetectionDistanceBinTool;
