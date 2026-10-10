import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contractId: string;
  readonly suppliedGoverningLanguage: string;
  readonly clauseSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contractId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedGoverningLanguage: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
    clauseSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["contractId", "suppliedGoverningLanguage", "clauseSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit contract governing-language assertion and clause source without translation or legal interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contractId, suppliedGoverningLanguage, clauseSource } = request;
  const compute = (): Output => {
    H.domain(contractId.length > 0, "contractId");
    H.domain(suppliedGoverningLanguage.length > 0, "suppliedGoverningLanguage");
    H.domain(clauseSource.length > 0, "clauseSource");
    return {
      token: JSON.stringify([
        contractId,
        suppliedGoverningLanguage,
        clauseSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contractId: "C17",
    suppliedGoverningLanguage: "English",
    clauseSource: "clause 4",
  },
  output: { token: '["C17","English","clause 4"]' },
} satisfies ToolExample<Input, Output>;
export const internationalContractGoverningLanguageKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/international-contract-governing-language-key",
      title: "International Contract Governing Language Key Tool",
      description:
        "Preserve an explicit contract governing-language assertion and clause source without translation or legal interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contractId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedGoverningLanguage: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          clauseSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["contractId", "suppliedGoverningLanguage", "clauseSource"],
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
            id: "contractId",
            label: "Contract Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedGoverningLanguage",
            label: "Supplied Governing Language",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "clauseSource",
            label: "Clause Source",
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
export const run = internationalContractGoverningLanguageKeyTool.execute;
export default internationalContractGoverningLanguageKeyTool;
