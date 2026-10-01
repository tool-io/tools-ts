import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventDay: number;
  readonly interviewDay: number;
  readonly recalledDays: number;
  readonly toleranceDays: number;
};
export type Output = {
  readonly elapsedDays: number;
  readonly discrepancyDays: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventDay: { type: "integer" },
    interviewDay: { type: "integer" },
    recalledDays: { type: "integer", minimum: 0 },
    toleranceDays: { type: "integer", minimum: 0 },
  },
  required: ["eventDay", "interviewDay", "recalledDays", "toleranceDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "integer" },
    discrepancyDays: { type: "integer" },
    withinTolerance: { type: "boolean" },
  },
  required: ["elapsedDays", "discrepancyDays", "withinTolerance"],
} as const;
/** Compare recalled elapsed days with a documented event interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventDay, interviewDay, recalledDays, toleranceDays } = request;
  const compute = (): Output => {
    H.integer(recalledDays, 0);
    H.integer(toleranceDays, 0);
    H.domain(interviewDay >= eventDay, "interviewDay");
    return {
      elapsedDays: interviewDay - eventDay,
      discrepancyDays: recalledDays - interviewDay + eventDay,
      withinTolerance:
        Math.abs(recalledDays - interviewDay + eventDay) <= toleranceDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventDay: 100,
    interviewDay: 130,
    recalledDays: 28,
    toleranceDays: 3,
  },
  output: { elapsedDays: 30, discrepancyDays: -2, withinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const maternityQuestionnaireRecallWindowGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "obstetrics/maternity-questionnaire-recall-window-gap",
      title: "Maternity Questionnaire Recall Window Gap Tool",
      description:
        "Compare recalled elapsed days with a documented event interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eventDay: { type: "integer" },
          interviewDay: { type: "integer" },
          recalledDays: { type: "integer", minimum: 0 },
          toleranceDays: { type: "integer", minimum: 0 },
        },
        required: ["eventDay", "interviewDay", "recalledDays", "toleranceDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsedDays: { type: "integer" },
          discrepancyDays: { type: "integer" },
          withinTolerance: { type: "boolean" },
        },
        required: ["elapsedDays", "discrepancyDays", "withinTolerance"],
      },
      ports: {
        inputs: [
          {
            id: "eventDay",
            label: "Event Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "interviewDay",
            label: "Interview Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "recalledDays",
            label: "Recalled Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "toleranceDays",
            label: "Tolerance Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "elapsedDays",
            label: "Elapsed Days",
            valueType: { type: "integer" },
          },
          {
            id: "discrepancyDays",
            label: "Discrepancy Days",
            valueType: { type: "integer" },
          },
          {
            id: "withinTolerance",
            label: "Within Tolerance",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = maternityQuestionnaireRecallWindowGapTool.execute;
export default maternityQuestionnaireRecallWindowGapTool;
