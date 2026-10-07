import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledVisits: number;
  readonly completedVisits: number;
};
export type Output = {
  readonly completedOpportunityFraction: number;
  readonly missedVisits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledVisits: { type: "integer", minimum: 1 },
    completedVisits: { type: "integer", minimum: 0 },
  },
  required: ["scheduledVisits", "completedVisits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedOpportunityFraction: { type: "number" },
    missedVisits: { type: "integer" },
  },
  required: ["completedOpportunityFraction", "missedVisits"],
} as const;
/** Describe completed plot-visit opportunities relative to an explicit schedule without estimating species detection probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledVisits, completedVisits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(scheduledVisits) &&
        scheduledVisits >= 1 &&
        scheduledVisits <= Number.MAX_SAFE_INTEGER,
      "scheduledVisits",
    ),
      scheduledVisits);
    (H.domain(
      Number.isSafeInteger(completedVisits) &&
        completedVisits >= 0 &&
        completedVisits <= scheduledVisits,
      "completedVisits",
    ),
      completedVisits);
    return {
      completedOpportunityFraction: completedVisits / scheduledVisits,
      missedVisits: scheduledVisits - completedVisits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduledVisits: 8, completedVisits: 6 },
  output: { completedOpportunityFraction: 0.75, missedVisits: 2 },
} satisfies ToolExample<Input, Output>;
export const plotDetectionOpportunityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/plot-detection-opportunity",
    title: "Plot Detection Opportunity",
    description:
      "Describe completed plot-visit opportunities relative to an explicit schedule without estimating species detection probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledVisits: { type: "integer", minimum: 1 },
        completedVisits: { type: "integer", minimum: 0 },
      },
      required: ["scheduledVisits", "completedVisits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completedOpportunityFraction: { type: "number" },
        missedVisits: { type: "integer" },
      },
      required: ["completedOpportunityFraction", "missedVisits"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledVisits",
          label: "Scheduled Visits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "completedVisits",
          label: "Completed Visits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "completedOpportunityFraction",
          label: "Completed Opportunity Fraction",
          valueType: { type: "number" },
        },
        {
          id: "missedVisits",
          label: "Missed Visits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = plotDetectionOpportunityTool.execute;
export default plotDetectionOpportunityTool;
