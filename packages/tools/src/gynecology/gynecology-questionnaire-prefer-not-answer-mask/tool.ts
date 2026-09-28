import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responses: readonly string[];
  readonly missingToken: string;
  readonly optOutToken: string;
};
export type Output = {
  readonly answered: readonly number[];
  readonly missing: readonly number[];
  readonly optOut: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingToken: { type: "string", maxLength: 8192 },
    optOutToken: { type: "string", maxLength: 8192 },
  },
  required: ["responses", "missingToken", "optOutToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answered: { type: "array", maxItems: 256, items: { type: "integer" } },
    missing: { type: "array", maxItems: 256, items: { type: "integer" } },
    optOut: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["answered", "missing", "optOut"],
} as const;
/** Separate answered, missing and prefer-not-to-answer positions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responses, missingToken, optOutToken } = request;
  const compute = (): Output => {
    H.domain(missingToken !== optOutToken, "optOutToken");
    return {
      answered: responses.flatMap((x, i) =>
        x !== missingToken && x !== optOutToken ? [i] : [],
      ),
      missing: responses.flatMap((x, i) => (x === missingToken ? [i] : [])),
      optOut: responses.flatMap((x, i) => (x === optOutToken ? [i] : [])),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responses: ["yes", "NA", "PNA", "no"],
    missingToken: "NA",
    optOutToken: "PNA",
  },
  output: { answered: [0, 3], missing: [1], optOut: [2] },
} satisfies ToolExample<Input, Output>;
export const gynecologyQuestionnairePreferNotAnswerMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gynecology/gynecology-questionnaire-prefer-not-answer-mask",
      title: "Gynecology Questionnaire Prefer Not Answer Mask Tool",
      description:
        "Separate answered, missing and prefer-not-to-answer positions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responses: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          missingToken: { type: "string", maxLength: 8192 },
          optOutToken: { type: "string", maxLength: 8192 },
        },
        required: ["responses", "missingToken", "optOutToken"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          answered: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          missing: { type: "array", maxItems: 256, items: { type: "integer" } },
          optOut: { type: "array", maxItems: 256, items: { type: "integer" } },
        },
        required: ["answered", "missing", "optOut"],
      },
      ports: {
        inputs: [
          {
            id: "responses",
            label: "Responses",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "missingToken",
            label: "Missing Token",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "optOutToken",
            label: "Opt Out Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "answered",
            label: "Answered",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "missing",
            label: "Missing",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "optOut",
            label: "Opt Out",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = gynecologyQuestionnairePreferNotAnswerMaskTool.execute;
export default gynecologyQuestionnairePreferNotAnswerMaskTool;
