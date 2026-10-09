import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingId: string;
  readonly usePurpose: string;
  readonly permissionRecorded: boolean;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingId: { type: "string", maxLength: 8192, minLength: 1 },
    usePurpose: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecorded: { type: "boolean" },
  },
  required: ["recordingId", "usePurpose", "permissionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label an explicitly recorded purpose-specific permission flag without determining recording or cultural access rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingId, usePurpose, permissionRecorded } = request;
  const compute = (): Output => {
    H.domain(recordingId.length > 0 && usePurpose.length > 0, "recordingId");
    return {
      tag:
        recordingId +
        "; purpose=" +
        JSON.stringify(usePurpose) +
        "; permission=" +
        (permissionRecorded ? "recorded" : "not recorded"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordingId: "REC17",
    usePurpose: "teaching",
    permissionRecorded: true,
  },
  output: { tag: 'REC17; purpose="teaching"; permission=recorded' },
} satisfies ToolExample<Input, Output>;
export const fieldRecordingConsentTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethnomusicology", "arts and design"],
      keywords: ["ethnomusicology", "arts and design"],
    },
    id: "ethnomusicology/field-recording-consent-tag",
    title: "Field Recording Consent Tag",
    description:
      "Label an explicitly recorded purpose-specific permission flag without determining recording or cultural access rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordingId: { type: "string", maxLength: 8192, minLength: 1 },
        usePurpose: { type: "string", maxLength: 8192, minLength: 1 },
        permissionRecorded: { type: "boolean" },
      },
      required: ["recordingId", "usePurpose", "permissionRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "recordingId",
          label: "Recording Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "usePurpose",
          label: "Use Purpose",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permissionRecorded",
          label: "Permission Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fieldRecordingConsentTagTool.execute;
export default fieldRecordingConsentTagTool;
