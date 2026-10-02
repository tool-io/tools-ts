import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: number;
  readonly completed: number;
  readonly cancelled: number;
  readonly excused: number;
  readonly includeCancelled: boolean;
  readonly includeExcused: boolean;
};
export type Output = {
  readonly opportunities: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "integer", minimum: 1 },
    completed: { type: "integer", minimum: 0 },
    cancelled: { type: "integer", minimum: 0 },
    excused: { type: "integer", minimum: 0 },
    includeCancelled: { type: "boolean" },
    includeExcused: { type: "boolean" },
  },
  required: [
    "scheduled",
    "completed",
    "cancelled",
    "excused",
    "includeCancelled",
    "includeExcused",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunities: { type: "integer" },
    fraction: { type: "number" },
  },
  required: ["opportunities", "fraction"],
} as const;
/** Calculate rehabilitation diary adherence opportunity base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    scheduled,
    completed,
    cancelled,
    excused,
    includeCancelled,
    includeExcused,
  } = request;
  const compute = (): Output => {
    H.integer(scheduled, 1);
    H.integer(completed, 0);
    H.integer(cancelled, 0);
    H.integer(excused, 0);
    H.domain(
      completed + cancelled + excused <= scheduled &&
        scheduled - cancelled - excused > 0,
    );
    return {
      opportunities:
        scheduled -
        (includeCancelled ? 0 : cancelled) -
        (includeExcused ? 0 : excused),
      fraction:
        completed /
        (scheduled -
          (includeCancelled ? 0 : cancelled) -
          (includeExcused ? 0 : excused)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduled: 20,
    completed: 12,
    cancelled: 3,
    excused: 2,
    includeCancelled: false,
    includeExcused: false,
  },
  output: { opportunities: 15, fraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const rehabilitationDiaryAdherenceOpportunityBaseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physiotherapy/rehabilitation-diary-adherence-opportunity-base",
      title: "Rehabilitation Diary Adherence Opportunity Base Tool",
      description:
        "Calculate rehabilitation diary adherence opportunity base from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scheduled: { type: "integer", minimum: 1 },
          completed: { type: "integer", minimum: 0 },
          cancelled: { type: "integer", minimum: 0 },
          excused: { type: "integer", minimum: 0 },
          includeCancelled: { type: "boolean" },
          includeExcused: { type: "boolean" },
        },
        required: [
          "scheduled",
          "completed",
          "cancelled",
          "excused",
          "includeCancelled",
          "includeExcused",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opportunities: { type: "integer" },
          fraction: { type: "number" },
        },
        required: ["opportunities", "fraction"],
      },
      ports: {
        inputs: [
          {
            id: "scheduled",
            label: "Scheduled",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "completed",
            label: "Completed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "cancelled",
            label: "Cancelled",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excused",
            label: "Excused",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeCancelled",
            label: "Include Cancelled",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "includeExcused",
            label: "Include Excused",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "opportunities",
            label: "Opportunities",
            valueType: { type: "integer" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = rehabilitationDiaryAdherenceOpportunityBaseTool.execute;
export default rehabilitationDiaryAdherenceOpportunityBaseTool;
