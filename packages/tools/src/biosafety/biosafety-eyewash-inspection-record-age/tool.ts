import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inspectionDay: number;
  readonly observationDay: number;
  readonly maximumAgeDays: number;
};
export type Output = {
  readonly ageDays: number;
  readonly remainingDays: number;
  readonly due: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inspectionDay: { type: "integer" },
    observationDay: { type: "integer" },
    maximumAgeDays: { type: "integer", minimum: 0 },
  },
  required: ["inspectionDay", "observationDay", "maximumAgeDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    remainingDays: { type: "integer" },
    due: { type: "boolean" },
  },
  required: ["ageDays", "remainingDays", "due"],
} as const;
/** Audit inspection-record age against a supplied interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inspectionDay, observationDay, maximumAgeDays } = request;
  const compute = (): Output => {
    H.domain(observationDay >= inspectionDay);
    H.integer(maximumAgeDays, 0);
    return {
      ageDays: observationDay - inspectionDay,
      remainingDays: maximumAgeDays - observationDay + inspectionDay,
      due: observationDay - inspectionDay > maximumAgeDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inspectionDay: 100, observationDay: 108, maximumAgeDays: 10 },
  output: { ageDays: 8, remainingDays: 2, due: false },
} satisfies ToolExample<Input, Output>;
export const biosafetyEyewashInspectionRecordAgeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-eyewash-inspection-record-age",
      title: "Biosafety Eyewash Inspection Record Age Tool",
      description: "Audit inspection-record age against a supplied interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inspectionDay: { type: "integer" },
          observationDay: { type: "integer" },
          maximumAgeDays: { type: "integer", minimum: 0 },
        },
        required: ["inspectionDay", "observationDay", "maximumAgeDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ageDays: { type: "integer" },
          remainingDays: { type: "integer" },
          due: { type: "boolean" },
        },
        required: ["ageDays", "remainingDays", "due"],
      },
      ports: {
        inputs: [
          {
            id: "inspectionDay",
            label: "Inspection Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "observationDay",
            label: "Observation Day",
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
          { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
          {
            id: "remainingDays",
            label: "Remaining Days",
            valueType: { type: "integer" },
          },
          { id: "due", label: "Due", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyEyewashInspectionRecordAgeTool.execute;
export default biosafetyEyewashInspectionRecordAgeTool;
