import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completed: number;
  readonly scheduled: number;
  readonly unknown: number;
  readonly excludeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly recordedCompletionShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completed: { type: "integer", minimum: 0 },
    scheduled: { type: "integer", minimum: 1 },
    unknown: { type: "integer", minimum: 0 },
    excludeUnknown: { type: "boolean" },
  },
  required: ["completed", "scheduled", "unknown", "excludeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    recordedCompletionShare: { type: "number" },
  },
  required: ["denominator", "recordedCompletionShare"],
} as const;
/** Record completeness under a supplied opportunity base, not a recommended brushing schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completed, scheduled, unknown, excludeUnknown } = request;
  const compute = (): Output => {
    H.integer(scheduled, 1);
    H.integer(unknown, 0, scheduled - 1);
    H.integer(completed, 0, scheduled - unknown);
    return {
      denominator: scheduled - (excludeUnknown ? unknown : 0),
      recordedCompletionShare:
        completed / (scheduled - (excludeUnknown ? unknown : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { completed: 8, scheduled: 12, unknown: 2, excludeUnknown: true },
  output: { denominator: 10, recordedCompletionShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const brushingLogOpportunityBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/brushing-log-opportunity-base",
    title: "Brushing Log Opportunity Base Tool",
    description:
      "Record completeness under a supplied opportunity base, not a recommended brushing schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completed: { type: "integer", minimum: 0 },
        scheduled: { type: "integer", minimum: 1 },
        unknown: { type: "integer", minimum: 0 },
        excludeUnknown: { type: "boolean" },
      },
      required: ["completed", "scheduled", "unknown", "excludeUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        recordedCompletionShare: { type: "number" },
      },
      required: ["denominator", "recordedCompletionShare"],
    },
    ports: {
      inputs: [
        {
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeUnknown",
          label: "Exclude Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "recordedCompletionShare",
          label: "Recorded Completion Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = brushingLogOpportunityBaseTool.execute;
export default brushingLogOpportunityBaseTool;
