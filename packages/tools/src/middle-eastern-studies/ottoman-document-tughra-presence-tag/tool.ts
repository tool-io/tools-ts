import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly presenceKnown: boolean;
  readonly presenceRecorded: boolean;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    presenceKnown: { type: "boolean" },
    presenceRecorded: { type: "boolean" },
  },
  required: ["documentId", "presenceKnown", "presenceRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Preserve an explicit Ottoman-document tughra presence observation without identifying or authenticating a sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, presenceKnown, presenceRecorded } = request;
  const compute = (): Output => {
    H.domain(documentId.length > 0, "documentId");
    H.domain(presenceKnown || !presenceRecorded, "presenceRecorded");
    return {
      status: presenceKnown
        ? presenceRecorded
          ? "present-recorded"
          : "absent-recorded"
        : "unknown",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "DOC17", presenceKnown: true, presenceRecorded: true },
  output: { status: "present-recorded" },
} satisfies ToolExample<Input, Output>;
export const ottomanDocumentTughraPresenceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "middle-eastern-studies",
        "middle eastern studies",
        "humanities",
      ],
      keywords: ["middle eastern studies", "humanities"],
    },
    id: "middle-eastern-studies/ottoman-document-tughra-presence-tag",
    title: "Ottoman Document Tughra Presence Tag",
    description:
      "Preserve an explicit Ottoman-document tughra presence observation without identifying or authenticating a sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        presenceKnown: { type: "boolean" },
        presenceRecorded: { type: "boolean" },
      },
      required: ["documentId", "presenceKnown", "presenceRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "presenceKnown",
          label: "Presence Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "presenceRecorded",
          label: "Presence Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = ottomanDocumentTughraPresenceTagTool.execute;
export default ottomanDocumentTughraPresenceTagTool;
