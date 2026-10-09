import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ruleId: string;
  readonly exceptionCode: string;
  readonly precedenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ruleId: { type: "string", maxLength: 8192, minLength: 1 },
    exceptionCode: { type: "string", maxLength: 8192, minLength: 1 },
    precedenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["ruleId", "exceptionCode", "precedenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit exception-precedence code by source without interpreting or applying an ethical rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ruleId, exceptionCode, precedenceSource } = request;
  const compute = (): Output => {
    H.domain(ruleId.length > 0, "ruleId");
    H.domain(exceptionCode.length > 0, "exceptionCode");
    H.domain(precedenceSource.length > 0, "precedenceSource");
    return { token: JSON.stringify([ruleId, exceptionCode, precedenceSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ruleId: "RULE17",
    exceptionCode: "EX2",
    precedenceSource: "Policy v2",
  },
  output: { token: '["RULE17","EX2","Policy v2"]' },
} satisfies ToolExample<Input, Output>;
export const exceptionRulePrecedenceSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethics", "philosophy"],
      keywords: ["ethics", "philosophy"],
    },
    id: "ethics/exception-rule-precedence-source-code",
    title: "Exception Rule Precedence Source Code",
    description:
      "Qualify an explicit exception-precedence code by source without interpreting or applying an ethical rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ruleId: { type: "string", maxLength: 8192, minLength: 1 },
        exceptionCode: { type: "string", maxLength: 8192, minLength: 1 },
        precedenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["ruleId", "exceptionCode", "precedenceSource"],
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
          id: "ruleId",
          label: "Rule Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exceptionCode",
          label: "Exception Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precedenceSource",
          label: "Precedence Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = exceptionRulePrecedenceSourceCodeTool.execute;
export default exceptionRulePrecedenceSourceCodeTool;
