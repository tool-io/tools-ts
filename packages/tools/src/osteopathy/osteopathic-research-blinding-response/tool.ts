import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly respondentId: string;
  readonly recordedGuess: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    respondentId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedGuess: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "respondentId", "recordedGuess"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit participant blinding response without evaluating blinding success. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, respondentId, recordedGuess } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(respondentId.length > 0, "respondentId");
    H.domain(recordedGuess.length > 0, "recordedGuess");
    return { token: JSON.stringify([studyId, respondentId, recordedGuess]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", respondentId: "P3", recordedGuess: "active" },
  output: { token: '["ST17","P3","active"]' },
} satisfies ToolExample<Input, Output>;
export const osteopathicResearchBlindingresponseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["osteopathy", "health and medicine"],
        keywords: ["osteopathy", "health and medicine"],
      },
      id: "osteopathy/osteopathic-research-blinding-response",
      title: "Osteopathic Research Blinding Response",
      description:
        "Record an explicit participant blinding response without evaluating blinding success.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          studyId: { type: "string", maxLength: 8192, minLength: 1 },
          respondentId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedGuess: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["studyId", "respondentId", "recordedGuess"],
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
            id: "recordedGuess",
            label: "Recorded Guess",
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
export const run = osteopathicResearchBlindingresponseTool.execute;
export default osteopathicResearchBlindingresponseTool;
