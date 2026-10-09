import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["active", "revoked", "partially-revoked", "unknown"],
    },
  },
  required: ["recordId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit consent-revocation status without establishing legal validity or authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["active", "revoked", "partially-revoked", "unknown"].includes(
        recordedStatus,
      ),
      "recordedStatus",
    );
    return { label: recordId + " [" + recordedStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", recordedStatus: "revoked" },
  output: { label: "R17 [revoked]" },
} satisfies ToolExample<Input, Output>;
export const decisionConsentRevocationStatusLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["ethics", "philosophy"],
        keywords: ["ethics", "philosophy"],
      },
      id: "ethics/decision-consent-revocation-status-label",
      title: "Decision Consent Revocation Status Label",
      description:
        "Label an explicit consent-revocation status without establishing legal validity or authorization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedStatus: {
            type: "string",
            maxLength: 8192,
            enum: ["active", "revoked", "partially-revoked", "unknown"],
          },
        },
        required: ["recordId", "recordedStatus"],
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
            id: "recordId",
            label: "Record Id",
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
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = decisionConsentRevocationStatusLabelTool.execute;
export default decisionConsentRevocationStatusLabelTool;
