import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly programId: string;
  readonly ruleId: string;
  readonly edition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    programId: { type: "string", maxLength: 8192, minLength: 1 },
    ruleId: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["programId", "ruleId", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit farm-support program rule by edition without deciding entitlements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { programId, ruleId, edition } = request;
  const compute = (): Output => {
    H.domain(programId.length > 0, "programId");
    H.domain(ruleId.length > 0, "ruleId");
    H.domain(edition.length > 0, "edition");
    return { token: JSON.stringify([programId, ruleId, edition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { programId: "PROG17", ruleId: "RULE2", edition: "v2" },
  output: { token: '["PROG17","RULE2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const supportProgramRuleEditionKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agricultural-policy", "agricultural policy", "agriculture"],
      keywords: ["agricultural policy", "agriculture"],
    },
    id: "agricultural-policy/support-program-rule-edition-key",
    title: "Support Program Rule Edition Key",
    description:
      "Qualify an explicit farm-support program rule by edition without deciding entitlements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        programId: { type: "string", maxLength: 8192, minLength: 1 },
        ruleId: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["programId", "ruleId", "edition"],
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
          id: "programId",
          label: "Program Id",
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
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = supportProgramRuleEditionKeyTool.execute;
export default supportProgramRuleEditionKeyTool;
