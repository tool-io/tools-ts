import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingId: string;
  readonly preferredCredit: string;
  readonly creditSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingId: { type: "string", maxLength: 8192, minLength: 1 },
    preferredCredit: { type: "string", maxLength: 8192, minLength: 1 },
    creditSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordingId", "preferredCredit", "creditSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit performer-credit wording and its source for a public recording without inferring attribution or permissions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingId, preferredCredit, creditSource } = request;
  const compute = (): Output => {
    H.domain(recordingId.length > 0, "recordingId");
    H.domain(preferredCredit.length > 0, "preferredCredit");
    H.domain(creditSource.length > 0, "creditSource");
    return {
      token: JSON.stringify([recordingId, preferredCredit, creditSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordingId: "REC17",
    preferredCredit: "Ensemble A",
    creditSource: "Approved program",
  },
  output: { token: '["REC17","Ensemble A","Approved program"]' },
} satisfies ToolExample<Input, Output>;
export const publicRecordingPerformerCreditTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["ethnomusicology", "arts and design"],
        keywords: ["ethnomusicology", "arts and design"],
      },
      id: "ethnomusicology/public-recording-performer-credit-token",
      title: "Public Recording Performer Credit Token",
      description:
        "Record explicit performer-credit wording and its source for a public recording without inferring attribution or permissions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordingId: { type: "string", maxLength: 8192, minLength: 1 },
          preferredCredit: { type: "string", maxLength: 8192, minLength: 1 },
          creditSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordingId", "preferredCredit", "creditSource"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
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
            id: "preferredCredit",
            label: "Preferred Credit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "creditSource",
            label: "Credit Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = publicRecordingPerformerCreditTokenTool.execute;
export default publicRecordingPerformerCreditTokenTool;
