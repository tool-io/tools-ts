import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedSupportChoice: string;
  readonly preferenceRecorded: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSupportChoice: { type: "string", maxLength: 8192, minLength: 1 },
    preferenceRecorded: { type: "boolean" },
  },
  required: ["recordId", "suppliedSupportChoice", "preferenceRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit communication-support preference flag without deciding consent validity or assigning support needs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedSupportChoice, preferenceRecorded } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 && suppliedSupportChoice.length > 0,
      "recordId",
    );
    return {
      token: JSON.stringify([
        recordId,
        suppliedSupportChoice,
        preferenceRecorded,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedSupportChoice: "Support A",
    preferenceRecorded: true,
  },
  output: { token: '["R17","Support A",true]' },
} satisfies ToolExample<Input, Output>;
export const communicationSupportConsentedChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["disability-studies", "disability studies", "social sciences"],
        keywords: ["disability studies", "social sciences"],
      },
      id: "disability-studies/communication-support-consented-choice",
      title: "Communication Support Consented Choice",
      description:
        "Record an explicit communication-support preference flag without deciding consent validity or assigning support needs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedSupportChoice: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          preferenceRecorded: { type: "boolean" },
        },
        required: ["recordId", "suppliedSupportChoice", "preferenceRecorded"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedSupportChoice",
            label: "Supplied Support Choice",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "preferenceRecorded",
            label: "Preference Recorded",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = communicationSupportConsentedChoiceTool.execute;
export default communicationSupportConsentedChoiceTool;
