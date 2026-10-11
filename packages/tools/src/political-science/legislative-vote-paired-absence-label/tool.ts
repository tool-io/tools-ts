import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly memberRecordId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memberRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["present", "absent", "paired-absence", "excused", "unknown"],
    },
  },
  required: ["memberRecordId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded legislative attendance or paired-absence status without inferring a vote. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { memberRecordId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(memberRecordId.length > 0, "memberRecordId");
    H.domain(
      ["present", "absent", "paired-absence", "excused", "unknown"].includes(
        recordedStatus,
      ),
      "recordedStatus",
    );
    return { label: memberRecordId + " [" + recordedStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { memberRecordId: "M17", recordedStatus: "paired-absence" },
  output: { label: "M17 [paired-absence]" },
} satisfies ToolExample<Input, Output>;
export const legislativeVotePairedAbsenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["political-science", "political science", "social sciences"],
      keywords: ["political science", "social sciences"],
    },
    id: "political-science/legislative-vote-paired-absence-label",
    title: "Legislative Vote Paired Absence Label",
    description:
      "Label an explicitly recorded legislative attendance or paired-absence status without inferring a vote.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        memberRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["present", "absent", "paired-absence", "excused", "unknown"],
        },
      },
      required: ["memberRecordId", "recordedStatus"],
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
          id: "memberRecordId",
          label: "Member Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedStatus",
          label: "Recorded Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = legislativeVotePairedAbsenceLabelTool.execute;
export default legislativeVotePairedAbsenceLabelTool;
