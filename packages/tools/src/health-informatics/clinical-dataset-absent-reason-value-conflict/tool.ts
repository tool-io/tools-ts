import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hasValue: boolean;
  readonly hasAbsentReason: boolean;
  readonly required: boolean;
};
export type Output = {
  readonly conflict: boolean;
  readonly missingRequired: boolean;
  readonly exactlyOne: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasValue: { type: "boolean" },
    hasAbsentReason: { type: "boolean" },
    required: { type: "boolean" },
  },
  required: ["hasValue", "hasAbsentReason", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conflict: { type: "boolean" },
    missingRequired: { type: "boolean" },
    exactlyOne: { type: "boolean" },
  },
  required: ["conflict", "missingRequired", "exactlyOne"],
} as const;
/** Audit a supplied value-versus-absent-reason exclusivity rule without interpreting a diagnosis or an absent-reason vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hasValue, hasAbsentReason, required } = request;
  const compute = (): Output => {
    return {
      conflict: hasValue && hasAbsentReason,
      missingRequired: required && !hasValue && !hasAbsentReason,
      exactlyOne: hasValue !== hasAbsentReason,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hasValue: true, hasAbsentReason: true, required: true },
  output: { conflict: true, missingRequired: false, exactlyOne: false },
} satisfies ToolExample<Input, Output>;
export const clinicalDatasetAbsentReasonValueConflictTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-informatics/clinical-dataset-absent-reason-value-conflict",
      title: "Clinical Dataset Absent Reason Value Conflict Tool",
      description:
        "Audit a supplied value-versus-absent-reason exclusivity rule without interpreting a diagnosis or an absent-reason vocabulary.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hasValue: { type: "boolean" },
          hasAbsentReason: { type: "boolean" },
          required: { type: "boolean" },
        },
        required: ["hasValue", "hasAbsentReason", "required"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conflict: { type: "boolean" },
          missingRequired: { type: "boolean" },
          exactlyOne: { type: "boolean" },
        },
        required: ["conflict", "missingRequired", "exactlyOne"],
      },
      ports: {
        inputs: [
          {
            id: "hasValue",
            label: "Has Value",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "hasAbsentReason",
            label: "Has Absent Reason",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "required",
            label: "Required",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "conflict", label: "Conflict", valueType: { type: "boolean" } },
          {
            id: "missingRequired",
            label: "Missing Required",
            valueType: { type: "boolean" },
          },
          {
            id: "exactlyOne",
            label: "Exactly One",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = clinicalDatasetAbsentReasonValueConflictTool.execute;
export default clinicalDatasetAbsentReasonValueConflictTool;
