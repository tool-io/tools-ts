import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issueId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issueId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["open", "closed", "deferred", "unknown"],
    },
  },
  required: ["issueId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded mediation agenda issue status without assessing agreement or resolving a dispute. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issueId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(issueId.length > 0, "issueId");
    H.domain(
      ["open", "closed", "deferred", "unknown"].includes(recordedStatus),
      "recordedStatus",
    );
    return { label: issueId + " [" + recordedStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issueId: "I17", recordedStatus: "deferred" },
  output: { label: "I17 [deferred]" },
} satisfies ToolExample<Input, Output>;
export const mediationAgendaOpenClosedIssueTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["peace-studies", "peace studies", "social sciences"],
      keywords: ["peace studies", "social sciences"],
    },
    id: "peace-studies/mediation-agenda-open-closed-issue-tag",
    title: "Mediation Agenda Open Closed Issue Tag",
    description:
      "Label an explicitly recorded mediation agenda issue status without assessing agreement or resolving a dispute.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issueId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["open", "closed", "deferred", "unknown"],
        },
      },
      required: ["issueId", "recordedStatus"],
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
          id: "issueId",
          label: "Issue Id",
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
export const run = mediationAgendaOpenClosedIssueTagTool.execute;
export default mediationAgendaOpenClosedIssueTagTool;
