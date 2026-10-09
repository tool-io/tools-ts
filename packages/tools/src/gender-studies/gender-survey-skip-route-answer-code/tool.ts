import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly suppliedAnswerCode: string;
  readonly routeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAnswerCode: { type: "string", maxLength: 8192, minLength: 1 },
    routeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemId", "suppliedAnswerCode", "routeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit survey answer or skip-route code by source without inferring identity from missing answers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, suppliedAnswerCode, routeSource } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0, "itemId");
    H.domain(suppliedAnswerCode.length > 0, "suppliedAnswerCode");
    H.domain(routeSource.length > 0, "routeSource");
    return { token: JSON.stringify([itemId, suppliedAnswerCode, routeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "Q17",
    suppliedAnswerCode: "SKIP2",
    routeSource: "Survey v2",
  },
  output: { token: '["Q17","SKIP2","Survey v2"]' },
} satisfies ToolExample<Input, Output>;
export const genderSurveySkipRouteAnswerCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["gender-studies", "gender studies", "social sciences"],
      keywords: ["gender studies", "social sciences"],
    },
    id: "gender-studies/gender-survey-skip-route-answer-code",
    title: "Gender Survey Skip Route Answer Code",
    description:
      "Qualify an explicit survey answer or skip-route code by source without inferring identity from missing answers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAnswerCode: { type: "string", maxLength: 8192, minLength: 1 },
        routeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemId", "suppliedAnswerCode", "routeSource"],
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
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAnswerCode",
          label: "Supplied Answer Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "routeSource",
          label: "Route Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = genderSurveySkipRouteAnswerCodeTool.execute;
export default genderSurveySkipRouteAnswerCodeTool;
