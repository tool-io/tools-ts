import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: string;
  readonly suppliedNeutralTokens: readonly string[];
  readonly caseSensitive: boolean;
};
export type Output = { readonly neutralUnderTokens: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "string", maxLength: 8192 },
    suppliedNeutralTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    caseSensitive: { type: "boolean" },
  },
  required: ["response", "suppliedNeutralTokens", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { neutralUnderTokens: { type: "boolean" } },
  required: ["neutralUnderTokens"],
} as const;
/** Compare a supplied response to explicit neutral-option labels without interpreting a validated questionnaire. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, suppliedNeutralTokens, caseSensitive } = request;
  const compute = (): Output => {
    const norm = (x: string) => (caseSensitive ? x : x.toLowerCase());
    return {
      neutralUnderTokens: suppliedNeutralTokens
        .map(norm)
        .includes(norm(response)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    response: "Neither",
    suppliedNeutralTokens: ["neither", "neutral"],
    caseSensitive: false,
  },
  output: { neutralUnderTokens: true },
} satisfies ToolExample<Input, Output>;
export const questionnaireNeutralOptionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/questionnaire-neutral-option-token",
    title: "Questionnaire Neutral Option Token Tool",
    description:
      "Compare a supplied response to explicit neutral-option labels without interpreting a validated questionnaire.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "string", maxLength: 8192 },
        suppliedNeutralTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        caseSensitive: { type: "boolean" },
      },
      required: ["response", "suppliedNeutralTokens", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { neutralUnderTokens: { type: "boolean" } },
      required: ["neutralUnderTokens"],
    },
    ports: {
      inputs: [
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedNeutralTokens",
          label: "Supplied Neutral Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "neutralUnderTokens",
          label: "Neutral Under Tokens",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = questionnaireNeutralOptionTokenTool.execute;
export default questionnaireNeutralOptionTokenTool;
