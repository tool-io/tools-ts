import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantCode: string;
  readonly respondentCode: string;
  readonly proxyDeclared: boolean;
};
export type Output = {
  readonly differentRespondent: boolean;
  readonly undisclosedDifference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantCode: { type: "string", maxLength: 8192, minLength: 1 },
    respondentCode: { type: "string", maxLength: 8192, minLength: 1 },
    proxyDeclared: { type: "boolean" },
  },
  required: ["participantCode", "respondentCode", "proxyDeclared"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    differentRespondent: { type: "boolean" },
    undisclosedDifference: { type: "boolean" },
  },
  required: ["differentRespondent", "undisclosedDifference"],
} as const;
/** Compare explicit survey participant and respondent identifiers with a supplied proxy declaration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantCode, respondentCode, proxyDeclared } = request;
  const compute = (): Output => {
    H.domain(
      participantCode.length > 0 && respondentCode.length > 0,
      "participantCode",
    );
    return {
      differentRespondent: participantCode !== respondentCode,
      undisclosedDifference:
        participantCode !== respondentCode && !proxyDeclared,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { participantCode: "P17", respondentCode: "R2", proxyDeclared: true },
  output: { differentRespondent: true, undisclosedDifference: false },
} satisfies ToolExample<Input, Output>;
export const olderadultSurveyProxyFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gerontology", "health and medicine"],
      keywords: ["gerontology", "health and medicine"],
    },
    id: "gerontology/older-adult-survey-proxy-flag",
    title: "Older Adult Survey Proxy Flag",
    description:
      "Compare explicit survey participant and respondent identifiers with a supplied proxy declaration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantCode: { type: "string", maxLength: 8192, minLength: 1 },
        respondentCode: { type: "string", maxLength: 8192, minLength: 1 },
        proxyDeclared: { type: "boolean" },
      },
      required: ["participantCode", "respondentCode", "proxyDeclared"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        differentRespondent: { type: "boolean" },
        undisclosedDifference: { type: "boolean" },
      },
      required: ["differentRespondent", "undisclosedDifference"],
    },
    ports: {
      inputs: [
        {
          id: "participantCode",
          label: "Participant Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "respondentCode",
          label: "Respondent Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "proxyDeclared",
          label: "Proxy Declared",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "differentRespondent",
          label: "Different Respondent",
          valueType: { type: "boolean" },
        },
        {
          id: "undisclosedDifference",
          label: "Undisclosed Difference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = olderadultSurveyProxyFlagTool.execute;
export default olderadultSurveyProxyFlagTool;
