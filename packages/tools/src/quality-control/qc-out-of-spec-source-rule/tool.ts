import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultRecordId: string;
  readonly ruleId: string;
  readonly ruleVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    ruleId: { type: "string", maxLength: 8192, minLength: 1 },
    ruleVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultRecordId", "ruleId", "ruleVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit out-of-specification source rule without applying or interpreting the rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultRecordId, ruleId, ruleVersion } = request;
  const compute = (): Output => {
    H.domain(resultRecordId.length > 0, "resultRecordId");
    H.domain(ruleId.length > 0, "ruleId");
    H.domain(ruleVersion.length > 0, "ruleVersion");
    return { token: JSON.stringify([resultRecordId, ruleId, ruleVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultRecordId: "R17", ruleId: "RULE2", ruleVersion: "v2" },
  output: { token: '["R17","RULE2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const qcOutOfSpecSourceRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-control",
        "quality control",
        "research and quality management",
      ],
      keywords: ["quality control", "research and quality management"],
    },
    id: "quality-control/qc-out-of-spec-source-rule",
    title: "QC Out Of Spec Source Rule",
    description:
      "Qualify an explicit out-of-specification source rule without applying or interpreting the rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        ruleId: { type: "string", maxLength: 8192, minLength: 1 },
        ruleVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultRecordId", "ruleId", "ruleVersion"],
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
          id: "resultRecordId",
          label: "Result Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ruleId",
          label: "Rule Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ruleVersion",
          label: "Rule Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qcOutOfSpecSourceRuleTool.execute;
export default qcOutOfSpecSourceRuleTool;
