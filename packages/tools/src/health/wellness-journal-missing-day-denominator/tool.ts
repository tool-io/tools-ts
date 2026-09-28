import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledDays: number;
  readonly missingDays: number;
  readonly excludedDays: number;
};
export type Output = {
  readonly observedDays: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledDays: { type: "integer", minimum: 0 },
    missingDays: { type: "integer", minimum: 0 },
    excludedDays: { type: "integer", minimum: 0 },
  },
  required: ["scheduledDays", "missingDays", "excludedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDays: { type: "integer" },
    denominator: { type: "integer" },
  },
  required: ["observedDays", "denominator"],
} as const;
/** Calculate wellness journal missing day denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledDays, missingDays, excludedDays } = request;
  const compute = (): Output => {
    H.integer(scheduledDays, 0);
    H.integer(excludedDays, 0, scheduledDays);
    H.integer(missingDays, 0, scheduledDays - excludedDays);
    return {
      observedDays: scheduledDays - missingDays - excludedDays,
      denominator: scheduledDays - excludedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduledDays: 30, missingDays: 3, excludedDays: 2 },
  output: { observedDays: 25, denominator: 28 },
} satisfies ToolExample<Input, Output>;
export const wellnessJournalMissingDayDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/wellness-journal-missing-day-denominator",
      title: "Wellness Journal Missing Day Denominator Tool",
      description:
        "Calculate wellness journal missing day denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scheduledDays: { type: "integer", minimum: 0 },
          missingDays: { type: "integer", minimum: 0 },
          excludedDays: { type: "integer", minimum: 0 },
        },
        required: ["scheduledDays", "missingDays", "excludedDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedDays: { type: "integer" },
          denominator: { type: "integer" },
        },
        required: ["observedDays", "denominator"],
      },
      ports: {
        inputs: [
          {
            id: "scheduledDays",
            label: "Scheduled Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missingDays",
            label: "Missing Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludedDays",
            label: "Excluded Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "observedDays",
            label: "Observed Days",
            valueType: { type: "integer" },
          },
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = wellnessJournalMissingDayDenominatorTool.execute;
export default wellnessJournalMissingDayDenominatorTool;
