import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agreementCode: string;
  readonly participantCode: string;
  readonly status: string;
};
export type Output = { readonly label: string; readonly optedIn: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agreementCode: { type: "string", maxLength: 8192, minLength: 1 },
    participantCode: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["granted", "declined", "pending", "withdrawn"],
    },
  },
  required: ["agreementCode", "participantCode", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    optedIn: { type: "boolean" },
  },
  required: ["label", "optedIn"],
} as const;
/** Render a recorded restorative-agreement participation consent state without inferring legal capacity or independently authorizing participation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agreementCode, participantCode, status } = request;
  const compute = (): Output => {
    H.domain(
      agreementCode.length > 0 && participantCode.length > 0,
      "agreementCode",
    );
    H.domain(
      ["granted", "declined", "pending", "withdrawn"].includes(status),
      "status",
    );
    return {
      label: agreementCode + "/" + participantCode + " [" + status + "]",
      optedIn: status === "granted",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { agreementCode: "AG17", participantCode: "P3", status: "pending" },
  output: { label: "AG17/P3 [pending]", optedIn: false },
} satisfies ToolExample<Input, Output>;
export const restorativeAgreementConsentStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/restorative-agreement-consent-status",
    title: "Restorative Agreement Consent Status",
    description:
      "Render a recorded restorative-agreement participation consent state without inferring legal capacity or independently authorizing participation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agreementCode: { type: "string", maxLength: 8192, minLength: 1 },
        participantCode: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["granted", "declined", "pending", "withdrawn"],
        },
      },
      required: ["agreementCode", "participantCode", "status"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        optedIn: { type: "boolean" },
      },
      required: ["label", "optedIn"],
    },
    ports: {
      inputs: [
        {
          id: "agreementCode",
          label: "Agreement Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "participantCode",
          label: "Participant Code",
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
        { id: "optedIn", label: "Opted In", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = restorativeAgreementConsentStatusTool.execute;
export default restorativeAgreementConsentStatusTool;
