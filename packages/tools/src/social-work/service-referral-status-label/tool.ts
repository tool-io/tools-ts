import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly referralCode: string; readonly status: string };
export type Output = { readonly label: string; readonly complete: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referralCode: { type: "string", maxLength: 8192 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["sent", "received", "accepted", "declined", "closed"],
    },
  },
  required: ["referralCode", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    complete: { type: "boolean" },
  },
  required: ["label", "complete"],
} as const;
/** Render a recorded service-referral status; closed means the record is closed, not that a client's needs were met. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referralCode, status } = request;
  const compute = (): Output => {
    H.domain(referralCode.length > 0, "referralCode");
    H.domain(
      ["sent", "received", "accepted", "declined", "closed"].includes(status),
      "status",
    );
    return {
      label: referralCode + " [" + status + "]",
      complete: status === "closed",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referralCode: "R17", status: "received" },
  output: { label: "R17 [received]", complete: false },
} satisfies ToolExample<Input, Output>;
export const serviceReferralStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/service-referral-status-label",
    title: "Service Referral Status Label Tool",
    description:
      "Render a recorded service-referral status; closed means the record is closed, not that a client's needs were met.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referralCode: { type: "string", maxLength: 8192 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["sent", "received", "accepted", "declined", "closed"],
        },
      },
      required: ["referralCode", "status"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        complete: { type: "boolean" },
      },
      required: ["label", "complete"],
    },
    ports: {
      inputs: [
        {
          id: "referralCode",
          label: "Referral Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "complete", label: "Complete", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = serviceReferralStatusLabelTool.execute;
export default serviceReferralStatusLabelTool;
