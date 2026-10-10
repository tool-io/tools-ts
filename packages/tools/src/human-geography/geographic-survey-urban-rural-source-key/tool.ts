import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areaCode: string;
  readonly classificationCode: string;
  readonly classificationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaCode: { type: "string", maxLength: 8192, minLength: 1 },
    classificationCode: { type: "string", maxLength: 8192, minLength: 1 },
    classificationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["areaCode", "classificationCode", "classificationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied urban/rural classification and source without deriving settlement categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areaCode, classificationCode, classificationSource } = request;
  const compute = (): Output => {
    H.domain(areaCode.length > 0, "areaCode");
    H.domain(classificationCode.length > 0, "classificationCode");
    H.domain(classificationSource.length > 0, "classificationSource");
    return {
      token: JSON.stringify([
        areaCode,
        classificationCode,
        classificationSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    areaCode: "A17",
    classificationCode: "URB",
    classificationSource: "Survey A v2",
  },
  output: { token: '["A17","URB","Survey A v2"]' },
} satisfies ToolExample<Input, Output>;
export const geographicSurveyUrbanRuralSourceKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["human-geography", "human geography", "social sciences"],
        keywords: ["human geography", "social sciences"],
      },
      id: "human-geography/geographic-survey-urban-rural-source-key",
      title: "Geographic Survey Urban Rural Source Key",
      description:
        "Record a supplied urban/rural classification and source without deriving settlement categories.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          areaCode: { type: "string", maxLength: 8192, minLength: 1 },
          classificationCode: { type: "string", maxLength: 8192, minLength: 1 },
          classificationSource: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["areaCode", "classificationCode", "classificationSource"],
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
            id: "areaCode",
            label: "Area Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "classificationCode",
            label: "Classification Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "classificationSource",
            label: "Classification Source",
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
export const run = geographicSurveyUrbanRuralSourceKeyTool.execute;
export default geographicSurveyUrbanRuralSourceKeyTool;
