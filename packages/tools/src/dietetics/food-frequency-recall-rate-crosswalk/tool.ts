import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedOccurrences: number;
  readonly recallDays: number;
};
export type Output = {
  readonly occurrencesPerDay: number;
  readonly occurrencesPerWeek: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedOccurrences: { type: "number", minimum: 0 },
    recallDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reportedOccurrences", "recallDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrencesPerDay: { type: "number" },
    occurrencesPerWeek: { type: "number" },
  },
  required: ["occurrencesPerDay", "occurrencesPerWeek"],
} as const;
/** Normalize an explicitly reported occurrence count over positive recall days without estimating serving size or nutrient intake. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedOccurrences, recallDays } = request;
  const compute = (): Output => {
    H.domain(reportedOccurrences >= 0, "reportedOccurrences");
    (H.domain(recallDays > 0, "recallDays"), recallDays);
    return {
      occurrencesPerDay: reportedOccurrences / recallDays,
      occurrencesPerWeek: (7 * reportedOccurrences) / recallDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedOccurrences: 6, recallDays: 14 },
  output: { occurrencesPerDay: 0.42857142857142855, occurrencesPerWeek: 3 },
} satisfies ToolExample<Input, Output>;
export const foodFrequencyRecallRateCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dietetics", "health and medicine"],
      keywords: ["dietetics", "health and medicine"],
    },
    id: "dietetics/food-frequency-recall-rate-crosswalk",
    title: "Food Frequency Recall Rate Crosswalk",
    description:
      "Normalize an explicitly reported occurrence count over positive recall days without estimating serving size or nutrient intake.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedOccurrences: { type: "number", minimum: 0 },
        recallDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reportedOccurrences", "recallDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occurrencesPerDay: { type: "number" },
        occurrencesPerWeek: { type: "number" },
      },
      required: ["occurrencesPerDay", "occurrencesPerWeek"],
    },
    ports: {
      inputs: [
        {
          id: "reportedOccurrences",
          label: "Reported Occurrences",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recallDays",
          label: "Recall Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "occurrencesPerDay",
          label: "Occurrences Per Day",
          valueType: { type: "number" },
        },
        {
          id: "occurrencesPerWeek",
          label: "Occurrences Per Week",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodFrequencyRecallRateCrosswalkTool.execute;
export default foodFrequencyRecallRateCrosswalkTool;
