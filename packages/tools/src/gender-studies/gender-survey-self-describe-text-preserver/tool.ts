import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseId: string;
  readonly suppliedSelfDescription: string;
};
export type Output = { readonly recordToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSelfDescription: { type: "string", maxLength: 8192 },
  },
  required: ["responseId", "suppliedSelfDescription"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recordToken: { type: "string", maxLength: 8192 } },
  required: ["recordToken"],
} as const;
/** Preserve exact supplied self-description text, including an empty response, without inferring gender identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseId, suppliedSelfDescription } = request;
  const compute = (): Output => {
    H.domain(responseId.length > 0, "responseId");
    return {
      recordToken: JSON.stringify([responseId, suppliedSelfDescription]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseId: "R17", suppliedSelfDescription: "self-description A" },
  output: { recordToken: '["R17","self-description A"]' },
} satisfies ToolExample<Input, Output>;
export const genderSurveySelfDescribeTextPreserverTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["gender-studies", "gender studies", "social sciences"],
        keywords: ["gender studies", "social sciences"],
      },
      id: "gender-studies/gender-survey-self-describe-text-preserver",
      title: "Gender Survey Self Describe Text Preserver",
      description:
        "Preserve exact supplied self-description text, including an empty response, without inferring gender identity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responseId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedSelfDescription: { type: "string", maxLength: 8192 },
        },
        required: ["responseId", "suppliedSelfDescription"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { recordToken: { type: "string", maxLength: 8192 } },
        required: ["recordToken"],
      },
      ports: {
        inputs: [
          {
            id: "responseId",
            label: "Response Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedSelfDescription",
            label: "Supplied Self Description",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "recordToken",
            label: "Record Token",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = genderSurveySelfDescribeTextPreserverTool.execute;
export default genderSurveySelfDescribeTextPreserverTool;
