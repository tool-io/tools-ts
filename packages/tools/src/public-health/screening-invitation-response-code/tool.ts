import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invitationId: string;
  readonly responseCode: string;
  readonly acceptedCode: string;
  readonly declinedCode: string;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invitationId: { type: "string", maxLength: 8192, minLength: 1 },
    responseCode: { type: "string", maxLength: 8192 },
    acceptedCode: { type: "string", maxLength: 8192 },
    declinedCode: { type: "string", maxLength: 8192 },
  },
  required: ["invitationId", "responseCode", "acceptedCode", "declinedCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Map explicit invitation response codes without determining screening eligibility or interpreting nonresponse. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invitationId, responseCode, acceptedCode, declinedCode } = request;
  const compute = (): Output => {
    H.domain(
      invitationId.length > 0 && acceptedCode !== declinedCode,
      "invitationId",
    );
    return {
      status:
        responseCode === acceptedCode
          ? "recorded-accepted"
          : responseCode === declinedCode
            ? "recorded-declined"
            : "other-or-unrecorded",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invitationId: "I17",
    responseCode: "Y",
    acceptedCode: "Y",
    declinedCode: "N",
  },
  output: { status: "recorded-accepted" },
} satisfies ToolExample<Input, Output>;
export const screeningInvitationResponseCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["public-health", "public health", "health and medicine"],
      keywords: ["public health", "health and medicine"],
    },
    id: "public-health/screening-invitation-response-code",
    title: "Screening Invitation Response Code",
    description:
      "Map explicit invitation response codes without determining screening eligibility or interpreting nonresponse.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invitationId: { type: "string", maxLength: 8192, minLength: 1 },
        responseCode: { type: "string", maxLength: 8192 },
        acceptedCode: { type: "string", maxLength: 8192 },
        declinedCode: { type: "string", maxLength: 8192 },
      },
      required: [
        "invitationId",
        "responseCode",
        "acceptedCode",
        "declinedCode",
      ],
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
          id: "invitationId",
          label: "Invitation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "responseCode",
          label: "Response Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "acceptedCode",
          label: "Accepted Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "declinedCode",
          label: "Declined Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = screeningInvitationResponseCodeTool.execute;
export default screeningInvitationResponseCodeTool;
