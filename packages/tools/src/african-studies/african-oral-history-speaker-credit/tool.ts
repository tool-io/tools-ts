import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferredCredit: string;
  readonly recordingId: string;
  readonly publicCreditConsent: boolean;
};
export type Output = { readonly credit: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferredCredit: { type: "string", maxLength: 8192 },
    recordingId: { type: "string", maxLength: 8192 },
    publicCreditConsent: { type: "boolean" },
  },
  required: ["preferredCredit", "recordingId", "publicCreditConsent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { credit: { type: "string", maxLength: 8192 } },
  required: ["credit"],
} as const;
/** Render a caller-approved oral-history speaker credit only when the explicit public-credit consent flag is set. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preferredCredit, recordingId, publicCreditConsent } = request;
  const compute = (): Output => {
    H.domain(recordingId.length > 0, "recordingId");
    H.domain(
      !publicCreditConsent || preferredCredit.length > 0,
      "publicCreditConsent",
    );
    return {
      credit:
        recordingId +
        " — " +
        (publicCreditConsent ? preferredCredit : "speaker credit withheld"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preferredCredit: "Speaker A",
    recordingId: "REC17",
    publicCreditConsent: true,
  },
  output: { credit: "REC17 — Speaker A" },
} satisfies ToolExample<Input, Output>;
export const africanOralHistorySpeakerCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/african-oral-history-speaker-credit",
    title: "African Oral History Speaker Credit Tool",
    description:
      "Render a caller-approved oral-history speaker credit only when the explicit public-credit consent flag is set.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferredCredit: { type: "string", maxLength: 8192 },
        recordingId: { type: "string", maxLength: 8192 },
        publicCreditConsent: { type: "boolean" },
      },
      required: ["preferredCredit", "recordingId", "publicCreditConsent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { credit: { type: "string", maxLength: 8192 } },
      required: ["credit"],
    },
    ports: {
      inputs: [
        {
          id: "preferredCredit",
          label: "Preferred Credit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordingId",
          label: "Recording Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publicCreditConsent",
          label: "Public Credit Consent",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "credit", label: "Credit", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = africanOralHistorySpeakerCreditTool.execute;
export default africanOralHistorySpeakerCreditTool;
