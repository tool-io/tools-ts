import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly verificationStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    verificationStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["verified", "unverified", "pending", "not-applicable"],
    },
  },
  required: ["recordId", "verificationStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied study diagnostic-verification status without interpreting test results. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, verificationStatus } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["verified", "unverified", "pending", "not-applicable"].includes(
        verificationStatus,
      ),
      "verificationStatus",
    );
    return { label: recordId + " [" + verificationStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", verificationStatus: "unverified" },
  output: { label: "R17 [unverified]" },
} satisfies ToolExample<Input, Output>;
export const diagnosticVerificationStatusTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/diagnostic-verification-status-tag",
    title: "Diagnostic Verification Status Tag",
    description:
      "Label a supplied study diagnostic-verification status without interpreting test results.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        verificationStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["verified", "unverified", "pending", "not-applicable"],
        },
      },
      required: ["recordId", "verificationStatus"],
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
          id: "verificationStatus",
          label: "Verification Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = diagnosticVerificationStatusTagTool.execute;
export default diagnosticVerificationStatusTagTool;
