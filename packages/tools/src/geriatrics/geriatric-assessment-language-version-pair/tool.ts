import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assessmentId: string;
  readonly suppliedLanguage: string;
  readonly instrumentVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessmentId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
    instrumentVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["assessmentId", "suppliedLanguage", "instrumentVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit geriatric assessment language and version without selecting or interpreting an instrument. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assessmentId, suppliedLanguage, instrumentVersion } = request;
  const compute = (): Output => {
    H.domain(assessmentId.length > 0, "assessmentId");
    H.domain(suppliedLanguage.length > 0, "suppliedLanguage");
    H.domain(instrumentVersion.length > 0, "instrumentVersion");
    return {
      token: JSON.stringify([
        assessmentId,
        suppliedLanguage,
        instrumentVersion,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assessmentId: "A17",
    suppliedLanguage: "en",
    instrumentVersion: "v2",
  },
  output: { token: '["A17","en","v2"]' },
} satisfies ToolExample<Input, Output>;
export const geriatricAssessmentLanguageVersionPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geriatrics/geriatric-assessment-language-version-pair",
      title: "Geriatric Assessment Language Version Pair Tool",
      description:
        "Record an explicit geriatric assessment language and version without selecting or interpreting an instrument.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assessmentId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
          instrumentVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["assessmentId", "suppliedLanguage", "instrumentVersion"],
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
            id: "assessmentId",
            label: "Assessment Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedLanguage",
            label: "Supplied Language",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "instrumentVersion",
            label: "Instrument Version",
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
export const run = geriatricAssessmentLanguageVersionPairTool.execute;
export default geriatricAssessmentLanguageVersionPairTool;
