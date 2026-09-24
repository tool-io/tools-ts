import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly active: boolean;
  readonly discontinued: boolean;
  readonly discontinuedDay: number;
  readonly observationDay: number;
  readonly effectiveOnDay: boolean;
};
export type Output = {
  readonly effectiveDiscontinuation: boolean;
  readonly conflict: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    active: { type: "boolean" },
    discontinued: { type: "boolean" },
    discontinuedDay: { type: "integer" },
    observationDay: { type: "integer" },
    effectiveOnDay: { type: "boolean" },
  },
  required: [
    "active",
    "discontinued",
    "discontinuedDay",
    "observationDay",
    "effectiveOnDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDiscontinuation: { type: "boolean" },
    conflict: { type: "boolean" },
  },
  required: ["effectiveDiscontinuation", "conflict"],
} as const;
/** Audit conflicting record status flags under an explicit effective-day convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    active,
    discontinued,
    discontinuedDay,
    observationDay,
    effectiveOnDay,
  } = request;
  const compute = (): Output => {
    const effectiveDiscontinuation =
      discontinued &&
      (effectiveOnDay
        ? observationDay >= discontinuedDay
        : observationDay > discontinuedDay);
    return {
      effectiveDiscontinuation,
      conflict: active && effectiveDiscontinuation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    active: true,
    discontinued: true,
    discontinuedDay: 100,
    observationDay: 100,
    effectiveOnDay: true,
  },
  output: { effectiveDiscontinuation: true, conflict: true },
} satisfies ToolExample<Input, Output>;
export const medicationRecordDiscontinuedActiveConflictTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-pharmacy/medication-record-discontinued-active-conflict",
      title: "Medication Record Discontinued Active Conflict Tool",
      description:
        "Audit conflicting record status flags under an explicit effective-day convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          active: { type: "boolean" },
          discontinued: { type: "boolean" },
          discontinuedDay: { type: "integer" },
          observationDay: { type: "integer" },
          effectiveOnDay: { type: "boolean" },
        },
        required: [
          "active",
          "discontinued",
          "discontinuedDay",
          "observationDay",
          "effectiveOnDay",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effectiveDiscontinuation: { type: "boolean" },
          conflict: { type: "boolean" },
        },
        required: ["effectiveDiscontinuation", "conflict"],
      },
      ports: {
        inputs: [
          {
            id: "active",
            label: "Active",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "discontinued",
            label: "Discontinued",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "discontinuedDay",
            label: "Discontinued Day",
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
            id: "effectiveOnDay",
            label: "Effective On Day",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "effectiveDiscontinuation",
            label: "Effective Discontinuation",
            valueType: { type: "boolean" },
          },
          { id: "conflict", label: "Conflict", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = medicationRecordDiscontinuedActiveConflictTool.execute;
export default medicationRecordDiscontinuedActiveConflictTool;
