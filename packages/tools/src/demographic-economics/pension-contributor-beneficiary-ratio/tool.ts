import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contributors: number;
  readonly beneficiaries: number;
};
export type Output = {
  readonly contributorsPerBeneficiary: number;
  readonly beneficiariesPerContributor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contributors: { type: "integer", minimum: 1 },
    beneficiaries: { type: "integer", minimum: 1 },
  },
  required: ["contributors", "beneficiaries"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contributorsPerBeneficiary: { type: "number" },
    beneficiariesPerContributor: { type: "number" },
  },
  required: ["contributorsPerBeneficiary", "beneficiariesPerContributor"],
} as const;
/** Describe two reciprocal pension-system headcount ratios from explicitly positive counts without evaluating financial sustainability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contributors, beneficiaries } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(contributors) &&
        contributors >= 1 &&
        contributors <= Number.MAX_SAFE_INTEGER,
      "contributors",
    ),
      contributors);
    (H.domain(
      Number.isSafeInteger(beneficiaries) &&
        beneficiaries >= 1 &&
        beneficiaries <= Number.MAX_SAFE_INTEGER,
      "beneficiaries",
    ),
      beneficiaries);
    return {
      contributorsPerBeneficiary: contributors / beneficiaries,
      beneficiariesPerContributor: beneficiaries / contributors,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contributors: 400, beneficiaries: 100 },
  output: { contributorsPerBeneficiary: 4, beneficiariesPerContributor: 0.25 },
} satisfies ToolExample<Input, Output>;
export const pensionContributorBeneficiaryRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["demographic-economics", "demographic economics", "economics"],
      keywords: ["demographic economics", "economics"],
    },
    id: "demographic-economics/pension-contributor-beneficiary-ratio",
    title: "Pension Contributor Beneficiary Ratio",
    description:
      "Describe two reciprocal pension-system headcount ratios from explicitly positive counts without evaluating financial sustainability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contributors: { type: "integer", minimum: 1 },
        beneficiaries: { type: "integer", minimum: 1 },
      },
      required: ["contributors", "beneficiaries"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contributorsPerBeneficiary: { type: "number" },
        beneficiariesPerContributor: { type: "number" },
      },
      required: ["contributorsPerBeneficiary", "beneficiariesPerContributor"],
    },
    ports: {
      inputs: [
        {
          id: "contributors",
          label: "Contributors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "beneficiaries",
          label: "Beneficiaries",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "contributorsPerBeneficiary",
          label: "Contributors Per Beneficiary",
          valueType: { type: "number" },
        },
        {
          id: "beneficiariesPerContributor",
          label: "Beneficiaries Per Contributor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pensionContributorBeneficiaryRatioTool.execute;
export default pensionContributorBeneficiaryRatioTool;
