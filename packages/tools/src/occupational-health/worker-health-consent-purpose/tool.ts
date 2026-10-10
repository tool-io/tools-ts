import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly purposeCode: string;
  readonly consentRecorded: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
    consentRecorded: { type: "boolean" },
  },
  required: ["recordId", "purposeCode", "consentRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit worker-health consent-purpose record without deciding permission or employment-related consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, purposeCode, consentRecorded } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && purposeCode.length > 0, "recordId");
    return {
      label:
        recordId +
        "; purpose=" +
        purposeCode +
        "; consent=" +
        (consentRecorded ? "recorded" : "not recorded"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "C17", purposeCode: "research", consentRecorded: true },
  output: { label: "C17; purpose=research; consent=recorded" },
} satisfies ToolExample<Input, Output>;
export const workerHealthConsentPurposeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-health",
        "occupational health",
        "health and medicine",
      ],
      keywords: ["occupational health", "health and medicine"],
    },
    id: "occupational-health/worker-health-consent-purpose",
    title: "Worker Health Consent Purpose",
    description:
      "Label an explicit worker-health consent-purpose record without deciding permission or employment-related consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
        consentRecorded: { type: "boolean" },
      },
      required: ["recordId", "purposeCode", "consentRecorded"],
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
          id: "purposeCode",
          label: "Purpose Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "consentRecorded",
          label: "Consent Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = workerHealthConsentPurposeTool.execute;
export default workerHealthConsentPurposeTool;
