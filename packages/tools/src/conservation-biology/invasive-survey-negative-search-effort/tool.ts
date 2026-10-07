import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly searchMinutes: number;
  readonly detected: boolean;
};
export type Output = { readonly negativeSearchMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    searchMinutes: { type: "number", minimum: 0 },
    detected: { type: "boolean" },
  },
  required: ["searchMinutes", "detected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { negativeSearchMinutes: { type: "number" } },
  required: ["negativeSearchMinutes"],
} as const;
/** Count supplied search effort only when an explicit detection flag is false without interpreting absence of detection as absence of a species. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { searchMinutes, detected } = request;
  const compute = (): Output => {
    H.domain(searchMinutes >= 0, "searchMinutes");
    return { negativeSearchMinutes: detected ? 0 : searchMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { searchMinutes: 45, detected: false },
  output: { negativeSearchMinutes: 45 },
} satisfies ToolExample<Input, Output>;
export const invasiveSurveyNegativeSearchEffortTool = H.defineSchemaCalculation<
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
    id: "conservation-biology/invasive-survey-negative-search-effort",
    title: "Invasive Survey Negative Search Effort",
    description:
      "Count supplied search effort only when an explicit detection flag is false without interpreting absence of detection as absence of a species.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        searchMinutes: { type: "number", minimum: 0 },
        detected: { type: "boolean" },
      },
      required: ["searchMinutes", "detected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { negativeSearchMinutes: { type: "number" } },
      required: ["negativeSearchMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "searchMinutes",
          label: "Search Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "detected",
          label: "Detected",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "negativeSearchMinutes",
          label: "Negative Search Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = invasiveSurveyNegativeSearchEffortTool.execute;
export default invasiveSurveyNegativeSearchEffortTool;
