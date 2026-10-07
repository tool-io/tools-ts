import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleDistance: number;
  readonly suppliedRatePerDistance: number;
  readonly otherEligibleCost: number;
};
export type Output = { readonly repaymentAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDistance: { type: "number", minimum: 0 },
    suppliedRatePerDistance: { type: "number", minimum: 0 },
    otherEligibleCost: { type: "number", minimum: 0 },
  },
  required: [
    "eligibleDistance",
    "suppliedRatePerDistance",
    "otherEligibleCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { repaymentAmount: { type: "number" } },
  required: ["repaymentAmount"],
} as const;
/** Apply explicit eligible travel distance, reimbursement rate, and other costs without selecting a repayment policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleDistance, suppliedRatePerDistance, otherEligibleCost } =
    request;
  const compute = (): Output => {
    H.domain(
      eligibleDistance >= 0 &&
        suppliedRatePerDistance >= 0 &&
        otherEligibleCost >= 0,
      "eligibleDistance",
    );
    return {
      repaymentAmount:
        eligibleDistance * suppliedRatePerDistance + otherEligibleCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleDistance: 24,
    suppliedRatePerDistance: 0.5,
    otherEligibleCost: 8,
  },
  output: { repaymentAmount: 20 },
} satisfies ToolExample<Input, Output>;
export const researchVisitTravelRepaymentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-research",
        "clinical research",
        "research and quality management",
      ],
      keywords: ["clinical research", "research and quality management"],
    },
    id: "clinical-research/research-visit-travel-repayment",
    title: "Research Visit Travel Repayment",
    description:
      "Apply explicit eligible travel distance, reimbursement rate, and other costs without selecting a repayment policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDistance: { type: "number", minimum: 0 },
        suppliedRatePerDistance: { type: "number", minimum: 0 },
        otherEligibleCost: { type: "number", minimum: 0 },
      },
      required: [
        "eligibleDistance",
        "suppliedRatePerDistance",
        "otherEligibleCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { repaymentAmount: { type: "number" } },
      required: ["repaymentAmount"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleDistance",
          label: "Eligible Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRatePerDistance",
          label: "Supplied Rate Per Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherEligibleCost",
          label: "Other Eligible Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "repaymentAmount",
          label: "Repayment Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchVisitTravelRepaymentTool.execute;
export default researchVisitTravelRepaymentTool;
