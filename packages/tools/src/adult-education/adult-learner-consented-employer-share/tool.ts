import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly learnerRecord: string;
  readonly consentToShare: boolean;
};
export type Output = { readonly sharedRecord: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    learnerRecord: { type: "string", maxLength: 8192 },
    consentToShare: { type: "boolean" },
  },
  required: ["learnerRecord", "consentToShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sharedRecord: { type: "string", maxLength: 8192 } },
  required: ["sharedRecord"],
} as const;
/** Return supplied learner-record text only under an explicit sharing permission flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { learnerRecord, consentToShare } = request;
  const compute = (): Output => {
    return { sharedRecord: consentToShare ? learnerRecord : "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { learnerRecord: "progress module 4", consentToShare: true },
  output: { sharedRecord: "progress module 4" },
} satisfies ToolExample<Input, Output>;
export const adultLearnerConsentedEmployerShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/adult-learner-consented-employer-share",
    title: "Adult Learner Consented Employer Share",
    description:
      "Return supplied learner-record text only under an explicit sharing permission flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        learnerRecord: { type: "string", maxLength: 8192 },
        consentToShare: { type: "boolean" },
      },
      required: ["learnerRecord", "consentToShare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sharedRecord: { type: "string", maxLength: 8192 } },
      required: ["sharedRecord"],
    },
    ports: {
      inputs: [
        {
          id: "learnerRecord",
          label: "Learner Record",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "consentToShare",
          label: "Consent To Share",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sharedRecord",
          label: "Shared Record",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = adultLearnerConsentedEmployerShareTool.execute;
export default adultLearnerConsentedEmployerShareTool;
