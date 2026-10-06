import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly reportedNightStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedNightStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["resident", "visitor", "absent", "unknown"],
    },
  },
  required: ["observationId", "reportedNightStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported household-night status without defining residence or household membership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, reportedNightStatus } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(
      ["resident", "visitor", "absent", "unknown"].includes(
        reportedNightStatus,
      ),
      "reportedNightStatus",
    );
    return { label: observationId + " [" + reportedNightStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationId: "O17", reportedNightStatus: "visitor" },
  output: { label: "O17 [visitor]" },
} satisfies ToolExample<Input, Output>;
export const householdVisitorResidentNightTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["anthropology", "social sciences"],
      keywords: ["anthropology", "social sciences"],
    },
    id: "anthropology/household-visitor-resident-night-tag",
    title: "Household Visitor Resident Night Tag",
    description:
      "Label an explicitly reported household-night status without defining residence or household membership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedNightStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["resident", "visitor", "absent", "unknown"],
        },
      },
      required: ["observationId", "reportedNightStatus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedNightStatus",
          label: "Reported Night Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = householdVisitorResidentNightTagTool.execute;
export default householdVisitorResidentNightTagTool;
