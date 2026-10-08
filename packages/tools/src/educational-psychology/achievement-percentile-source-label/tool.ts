import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly percentile: number;
  readonly referencePopulation: string;
  readonly assessmentVersion: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    percentile: { type: "number", minimum: 0, maximum: 100 },
    referencePopulation: { type: "string", maxLength: 8192, minLength: 1 },
    assessmentVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["percentile", "referencePopulation", "assessmentVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied achievement percentile and norm-source metadata without computing or interpreting a percentile. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { percentile, referencePopulation, assessmentVersion } = request;
  const compute = (): Output => {
    H.domain(
      percentile >= 0 &&
        percentile <= 100 &&
        referencePopulation.length > 0 &&
        assessmentVersion.length > 0,
      "percentile",
    );
    return {
      label:
        "percentile " +
        percentile +
        " [" +
        referencePopulation +
        "; " +
        assessmentVersion +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    percentile: 75,
    referencePopulation: "reference cohort 2020",
    assessmentVersion: "v2",
  },
  output: { label: "percentile 75 [reference cohort 2020; v2]" },
} satisfies ToolExample<Input, Output>;
export const achievementPercentileSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "educational-psychology",
        "educational psychology",
        "psychology",
      ],
      keywords: ["educational psychology", "psychology"],
    },
    id: "educational-psychology/achievement-percentile-source-label",
    title: "Achievement Percentile Source Label",
    description:
      "Label an explicitly supplied achievement percentile and norm-source metadata without computing or interpreting a percentile.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        percentile: { type: "number", minimum: 0, maximum: 100 },
        referencePopulation: { type: "string", maxLength: 8192, minLength: 1 },
        assessmentVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["percentile", "referencePopulation", "assessmentVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "percentile",
          label: "Percentile",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePopulation",
          label: "Reference Population",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assessmentVersion",
          label: "Assessment Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = achievementPercentileSourceLabelTool.execute;
export default achievementPercentileSourceLabelTool;
