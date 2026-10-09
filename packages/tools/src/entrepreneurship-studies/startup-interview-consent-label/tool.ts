import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interviewCode: string;
  readonly purpose: string;
  readonly consentRecorded: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interviewCode: { type: "string", maxLength: 8192, minLength: 1 },
    purpose: { type: "string", maxLength: 8192, minLength: 1 },
    consentRecorded: { type: "boolean" },
  },
  required: ["interviewCode", "purpose", "consentRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a purpose-specific recorded interview-consent flag without determining permission or legal validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interviewCode, purpose, consentRecorded } = request;
  const compute = (): Output => {
    H.domain(interviewCode.length > 0 && purpose.length > 0, "interviewCode");
    return {
      label:
        interviewCode +
        "; purpose=" +
        JSON.stringify(purpose) +
        "; consent=" +
        (consentRecorded ? "recorded" : "not recorded"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interviewCode: "INT17",
    purpose: "product feedback",
    consentRecorded: true,
  },
  output: { label: 'INT17; purpose="product feedback"; consent=recorded' },
} satisfies ToolExample<Input, Output>;
export const startupInterviewConsentLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "entrepreneurship-studies",
        "entrepreneurship studies",
        "business and finance",
      ],
      keywords: ["entrepreneurship studies", "business and finance"],
    },
    id: "entrepreneurship-studies/startup-interview-consent-label",
    title: "Startup Interview Consent Label",
    description:
      "Format a purpose-specific recorded interview-consent flag without determining permission or legal validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interviewCode: { type: "string", maxLength: 8192, minLength: 1 },
        purpose: { type: "string", maxLength: 8192, minLength: 1 },
        consentRecorded: { type: "boolean" },
      },
      required: ["interviewCode", "purpose", "consentRecorded"],
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
          id: "interviewCode",
          label: "Interview Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "purpose",
          label: "Purpose",
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
export const run = startupInterviewConsentLabelTool.execute;
export default startupInterviewConsentLabelTool;
