import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ageAtBaselineDays: number;
  readonly elapsedDays: number;
  readonly minimumAgeDays: number;
  readonly maximumAgeDays: number;
};
export type Output = {
  readonly ageAtVisitDays: number;
  readonly minimumMargin: number;
  readonly maximumMargin: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageAtBaselineDays: { type: "integer", minimum: 0 },
    elapsedDays: { type: "integer", minimum: 0 },
    minimumAgeDays: { type: "integer", minimum: 0 },
    maximumAgeDays: { type: "integer" },
  },
  required: [
    "ageAtBaselineDays",
    "elapsedDays",
    "minimumAgeDays",
    "maximumAgeDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageAtVisitDays: { type: "integer" },
    minimumMargin: { type: "integer" },
    maximumMargin: { type: "integer" },
    inside: { type: "boolean" },
  },
  required: ["ageAtVisitDays", "minimumMargin", "maximumMargin", "inside"],
} as const;
/** Calculate pediatric research followup age window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageAtBaselineDays, elapsedDays, minimumAgeDays, maximumAgeDays } =
    request;
  const compute = (): Output => {
    H.integer(ageAtBaselineDays, 0);
    H.integer(elapsedDays, 0);
    H.integer(minimumAgeDays, 0);
    H.integer(maximumAgeDays, minimumAgeDays);
    return {
      ageAtVisitDays: ageAtBaselineDays + elapsedDays,
      minimumMargin: ageAtBaselineDays + elapsedDays - minimumAgeDays,
      maximumMargin: maximumAgeDays - ageAtBaselineDays - elapsedDays,
      inside:
        ageAtBaselineDays + elapsedDays >= minimumAgeDays &&
        ageAtBaselineDays + elapsedDays <= maximumAgeDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ageAtBaselineDays: 100,
    elapsedDays: 50,
    minimumAgeDays: 120,
    maximumAgeDays: 180,
  },
  output: {
    ageAtVisitDays: 150,
    minimumMargin: 30,
    maximumMargin: 30,
    inside: true,
  },
} satisfies ToolExample<Input, Output>;
export const pediatricResearchFollowupAgeWindowGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pediatrics/pediatric-research-followup-age-window-gap",
      title: "Pediatric Research Followup Age Window Gap Tool",
      description:
        "Calculate pediatric research followup age window gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ageAtBaselineDays: { type: "integer", minimum: 0 },
          elapsedDays: { type: "integer", minimum: 0 },
          minimumAgeDays: { type: "integer", minimum: 0 },
          maximumAgeDays: { type: "integer" },
        },
        required: [
          "ageAtBaselineDays",
          "elapsedDays",
          "minimumAgeDays",
          "maximumAgeDays",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ageAtVisitDays: { type: "integer" },
          minimumMargin: { type: "integer" },
          maximumMargin: { type: "integer" },
          inside: { type: "boolean" },
        },
        required: [
          "ageAtVisitDays",
          "minimumMargin",
          "maximumMargin",
          "inside",
        ],
      },
      ports: {
        inputs: [
          {
            id: "ageAtBaselineDays",
            label: "Age At Baseline Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "elapsedDays",
            label: "Elapsed Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "minimumAgeDays",
            label: "Minimum Age Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "maximumAgeDays",
            label: "Maximum Age Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "ageAtVisitDays",
            label: "Age At Visit Days",
            valueType: { type: "integer" },
          },
          {
            id: "minimumMargin",
            label: "Minimum Margin",
            valueType: { type: "integer" },
          },
          {
            id: "maximumMargin",
            label: "Maximum Margin",
            valueType: { type: "integer" },
          },
          { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = pediatricResearchFollowupAgeWindowGapTool.execute;
export default pediatricResearchFollowupAgeWindowGapTool;
