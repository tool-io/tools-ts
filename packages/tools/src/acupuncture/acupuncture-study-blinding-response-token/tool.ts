import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly respondentId: string;
  readonly responseText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    respondentId: { type: "string", maxLength: 8192, minLength: 1 },
    responseText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "respondentId", "responseText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit study blinding response without evaluating treatment assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, respondentId, responseText } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(respondentId.length > 0, "respondentId");
    H.domain(responseText.length > 0, "responseText");
    return { token: JSON.stringify([studyId, respondentId, responseText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", respondentId: "P17", responseText: "unsure" },
  output: { token: '["ST17","P17","unsure"]' },
} satisfies ToolExample<Input, Output>;
export const acupunctureStudyBlindingresponseTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["acupuncture", "health and medicine"],
        keywords: ["acupuncture", "health and medicine"],
      },
      id: "acupuncture/acupuncture-study-blinding-response-token",
      title: "Acupuncture Study Blinding Response Token",
      description:
        "Preserve an explicit study blinding response without evaluating treatment assignment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          studyId: { type: "string", maxLength: 8192, minLength: 1 },
          respondentId: { type: "string", maxLength: 8192, minLength: 1 },
          responseText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["studyId", "respondentId", "responseText"],
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
            id: "studyId",
            label: "Study Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "respondentId",
            label: "Respondent Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "responseText",
            label: "Response Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = acupunctureStudyBlindingresponseTokenTool.execute;
export default acupunctureStudyBlindingresponseTokenTool;
