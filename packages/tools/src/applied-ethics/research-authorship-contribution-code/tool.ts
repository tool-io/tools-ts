import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contributorId: string;
  readonly workId: string;
  readonly suppliedRoleCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contributorId: { type: "string", maxLength: 8192, minLength: 1 },
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRoleCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["contributorId", "workId", "suppliedRoleCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied research contribution code without determining authorship eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contributorId, workId, suppliedRoleCode } = request;
  const compute = (): Output => {
    H.domain(contributorId.length > 0, "contributorId");
    H.domain(workId.length > 0, "workId");
    H.domain(suppliedRoleCode.length > 0, "suppliedRoleCode");
    return { token: JSON.stringify([contributorId, workId, suppliedRoleCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contributorId: "A17", workId: "W4", suppliedRoleCode: "analysis" },
  output: { token: '["A17","W4","analysis"]' },
} satisfies ToolExample<Input, Output>;
export const researchAuthorshipContributionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/research-authorship-contribution-code",
    title: "Research Authorship Contribution Code",
    description:
      "Record a supplied research contribution code without determining authorship eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contributorId: { type: "string", maxLength: 8192, minLength: 1 },
        workId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRoleCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["contributorId", "workId", "suppliedRoleCode"],
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
          id: "contributorId",
          label: "Contributor Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "workId",
          label: "Work Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRoleCode",
          label: "Supplied Role Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = researchAuthorshipContributionCodeTool.execute;
export default researchAuthorshipContributionCodeTool;
