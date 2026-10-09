import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingRemainingDeductible: number;
  readonly eligibleAppliedAmount: number;
};
export type Output = {
  readonly closingRemainingDeductible: number;
  readonly appliedToDeductible: number;
  readonly excessEligibleAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingRemainingDeductible: { type: "number", minimum: 0 },
    eligibleAppliedAmount: { type: "number", minimum: 0 },
  },
  required: ["openingRemainingDeductible", "eligibleAppliedAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingRemainingDeductible: { type: "number" },
    appliedToDeductible: { type: "number" },
    excessEligibleAmount: { type: "number" },
  },
  required: [
    "closingRemainingDeductible",
    "appliedToDeductible",
    "excessEligibleAmount",
  ],
} as const;
/** Update an explicit remaining deductible using a caller-supplied eligible amount without adjudicating coverage or cost sharing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingRemainingDeductible, eligibleAppliedAmount } = request;
  const compute = (): Output => {
    H.domain(
      openingRemainingDeductible >= 0 && eligibleAppliedAmount >= 0,
      "openingRemainingDeductible",
    );
    return (() => {
      const appliedToDeductible = Math.min(
        openingRemainingDeductible,
        eligibleAppliedAmount,
      );
      return {
        closingRemainingDeductible:
          openingRemainingDeductible - appliedToDeductible,
        appliedToDeductible,
        excessEligibleAmount: eligibleAppliedAmount - appliedToDeductible,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingRemainingDeductible: 100, eligibleAppliedAmount: 60 },
  output: {
    closingRemainingDeductible: 40,
    appliedToDeductible: 60,
    excessEligibleAmount: 0,
  },
} satisfies ToolExample<Input, Output>;
export const insuranceRemainingDeductibleStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["health-policy", "health policy", "social sciences"],
      keywords: ["health policy", "social sciences"],
    },
    id: "health-policy/insurance-remaining-deductible-step",
    title: "Insurance Remaining Deductible Step",
    description:
      "Update an explicit remaining deductible using a caller-supplied eligible amount without adjudicating coverage or cost sharing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingRemainingDeductible: { type: "number", minimum: 0 },
        eligibleAppliedAmount: { type: "number", minimum: 0 },
      },
      required: ["openingRemainingDeductible", "eligibleAppliedAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closingRemainingDeductible: { type: "number" },
        appliedToDeductible: { type: "number" },
        excessEligibleAmount: { type: "number" },
      },
      required: [
        "closingRemainingDeductible",
        "appliedToDeductible",
        "excessEligibleAmount",
      ],
    },
    ports: {
      inputs: [
        {
          id: "openingRemainingDeductible",
          label: "Opening Remaining Deductible",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleAppliedAmount",
          label: "Eligible Applied Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingRemainingDeductible",
          label: "Closing Remaining Deductible",
          valueType: { type: "number" },
        },
        {
          id: "appliedToDeductible",
          label: "Applied To Deductible",
          valueType: { type: "number" },
        },
        {
          id: "excessEligibleAmount",
          label: "Excess Eligible Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insuranceRemainingDeductibleStepTool.execute;
export default insuranceRemainingDeductibleStepTool;
