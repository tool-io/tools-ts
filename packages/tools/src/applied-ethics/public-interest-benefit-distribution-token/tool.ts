import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proposalId: string;
  readonly beneficiaryGroup: string;
  readonly distributionNote: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proposalId: { type: "string", maxLength: 8192, minLength: 1 },
    beneficiaryGroup: { type: "string", maxLength: 8192, minLength: 1 },
    distributionNote: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["proposalId", "beneficiaryGroup", "distributionNote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied public-interest benefit distribution note without evaluating ethical merit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proposalId, beneficiaryGroup, distributionNote } = request;
  const compute = (): Output => {
    H.domain(proposalId.length > 0, "proposalId");
    H.domain(beneficiaryGroup.length > 0, "beneficiaryGroup");
    H.domain(distributionNote.length > 0, "distributionNote");
    return {
      token: JSON.stringify([proposalId, beneficiaryGroup, distributionNote]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    proposalId: "P17",
    beneficiaryGroup: "residents",
    distributionNote: "equal access",
  },
  output: { token: '["P17","residents","equal access"]' },
} satisfies ToolExample<Input, Output>;
export const publicInterestBenefitDistributionTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["applied-ethics", "applied ethics", "philosophy"],
        keywords: ["applied ethics", "philosophy"],
      },
      id: "applied-ethics/public-interest-benefit-distribution-token",
      title: "Public Interest Benefit Distribution Token",
      description:
        "Preserve a supplied public-interest benefit distribution note without evaluating ethical merit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          proposalId: { type: "string", maxLength: 8192, minLength: 1 },
          beneficiaryGroup: { type: "string", maxLength: 8192, minLength: 1 },
          distributionNote: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["proposalId", "beneficiaryGroup", "distributionNote"],
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
            id: "proposalId",
            label: "Proposal Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "beneficiaryGroup",
            label: "Beneficiary Group",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "distributionNote",
            label: "Distribution Note",
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
export const run = publicInterestBenefitDistributionTokenTool.execute;
export default publicInterestBenefitDistributionTokenTool;
