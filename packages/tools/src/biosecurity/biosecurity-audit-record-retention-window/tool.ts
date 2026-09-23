import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly createdDay: number;
  readonly observationDay: number;
  readonly retentionDays: number;
  readonly hold: boolean;
  readonly removed: boolean;
};
export type Output = {
  readonly dueDay: number;
  readonly remainingDays: number;
  readonly dueUnderRule: boolean;
  readonly retainedBeyondRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    createdDay: { type: "integer" },
    observationDay: { type: "integer" },
    retentionDays: { type: "integer", minimum: 0 },
    hold: { type: "boolean" },
    removed: { type: "boolean" },
  },
  required: [
    "createdDay",
    "observationDay",
    "retentionDays",
    "hold",
    "removed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dueDay: { type: "integer" },
    remainingDays: { type: "integer" },
    dueUnderRule: { type: "boolean" },
    retainedBeyondRule: { type: "boolean" },
  },
  required: ["dueDay", "remainingDays", "dueUnderRule", "retainedBeyondRule"],
} as const;
/** Audit explicit record-retention timing and hold/removal flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { createdDay, observationDay, retentionDays, hold, removed } = request;
  const compute = (): Output => {
    H.integer(retentionDays, 0);
    H.domain(observationDay >= createdDay);
    const dueDay = createdDay + retentionDays,
      dueUnderRule = observationDay >= dueDay && !hold;
    return {
      dueDay,
      remainingDays: dueDay - observationDay,
      dueUnderRule,
      retainedBeyondRule: dueUnderRule && !removed,
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
    hold: false,
    removed: false,
  },
  output: {
    dueDay: 130,
    remainingDays: -10,
    dueUnderRule: true,
    retainedBeyondRule: true,
  },
} satisfies ToolExample<Input, Output>;
export const biosecurityAuditRecordRetentionWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-audit-record-retention-window",
      title: "Biosecurity Audit Record Retention Window Tool",
      description:
        "Audit explicit record-retention timing and hold/removal flags.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          createdDay: { type: "integer" },
          observationDay: { type: "integer" },
          retentionDays: { type: "integer", minimum: 0 },
          hold: { type: "boolean" },
          removed: { type: "boolean" },
        },
        required: [
          "createdDay",
          "observationDay",
          "retentionDays",
          "hold",
          "removed",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dueDay: { type: "integer" },
          remainingDays: { type: "integer" },
          dueUnderRule: { type: "boolean" },
          retainedBeyondRule: { type: "boolean" },
        },
        required: [
          "dueDay",
          "remainingDays",
          "dueUnderRule",
          "retainedBeyondRule",
        ],
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
            id: "hold",
            label: "Hold",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "removed",
            label: "Removed",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "dueDay", label: "Due Day", valueType: { type: "integer" } },
          {
            id: "remainingDays",
            label: "Remaining Days",
            valueType: { type: "integer" },
          },
          {
            id: "dueUnderRule",
            label: "Due Under Rule",
            valueType: { type: "boolean" },
          },
          {
            id: "retainedBeyondRule",
            label: "Retained Beyond Rule",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityAuditRecordRetentionWindowTool.execute;
export default biosecurityAuditRecordRetentionWindowTool;
