import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly createdDay: number;
  readonly observationDay: number;
  readonly retentionDays: number;
  readonly holdActive: boolean;
  readonly deleted: boolean;
};
export type Output = {
  readonly ageDays: number;
  readonly dueDay: number;
  readonly deletionDue: boolean;
  readonly retainedPastWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    createdDay: { type: "integer" },
    observationDay: { type: "integer" },
    retentionDays: { type: "integer", minimum: 0 },
    holdActive: { type: "boolean" },
    deleted: { type: "boolean" },
  },
  required: [
    "createdDay",
    "observationDay",
    "retentionDays",
    "holdActive",
    "deleted",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    dueDay: { type: "integer" },
    deletionDue: { type: "boolean" },
    retainedPastWindow: { type: "boolean" },
  },
  required: ["ageDays", "dueDay", "deletionDue", "retainedPastWindow"],
} as const;
/** Audit an explicit template retention interval and supplied hold/deletion flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { createdDay, observationDay, retentionDays, holdActive, deleted } =
    request;
  const compute = (): Output => {
    H.integer(retentionDays, 0);
    H.domain(observationDay >= createdDay);
    const deletionDue =
      observationDay >= createdDay + retentionDays && !holdActive;
    return {
      ageDays: observationDay - createdDay,
      dueDay: createdDay + retentionDays,
      deletionDue,
      retainedPastWindow: deletionDue && !deleted,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    createdDay: 100,
    observationDay: 140,
    retentionDays: 30,
    holdActive: false,
    deleted: false,
  },
  output: {
    ageDays: 40,
    dueDay: 130,
    deletionDue: true,
    retainedPastWindow: true,
  },
} satisfies ToolExample<Input, Output>;
export const biometricTemplateExplicitRetentionWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-template-explicit-retention-window",
      title: "Biometric Template Explicit Retention Window Tool",
      description:
        "Audit an explicit template retention interval and supplied hold/deletion flags.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          createdDay: { type: "integer" },
          observationDay: { type: "integer" },
          retentionDays: { type: "integer", minimum: 0 },
          holdActive: { type: "boolean" },
          deleted: { type: "boolean" },
        },
        required: [
          "createdDay",
          "observationDay",
          "retentionDays",
          "holdActive",
          "deleted",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ageDays: { type: "integer" },
          dueDay: { type: "integer" },
          deletionDue: { type: "boolean" },
          retainedPastWindow: { type: "boolean" },
        },
        required: ["ageDays", "dueDay", "deletionDue", "retainedPastWindow"],
      },
      ports: {
        inputs: [
          {
            id: "createdDay",
            label: "Created Day",
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
            id: "retentionDays",
            label: "Retention Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "holdActive",
            label: "Hold Active",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "deleted",
            label: "Deleted",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
          { id: "dueDay", label: "Due Day", valueType: { type: "integer" } },
          {
            id: "deletionDue",
            label: "Deletion Due",
            valueType: { type: "boolean" },
          },
          {
            id: "retainedPastWindow",
            label: "Retained Past Window",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biometricTemplateExplicitRetentionWindowTool.execute;
export default biometricTemplateExplicitRetentionWindowTool;
