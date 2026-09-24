import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossCost: number;
  readonly eligibleCost: number;
  readonly suppliedCap: number;
};
export type Output = {
  readonly cappedEligible: number;
  readonly unreimbursedCost: number;
  readonly capHeadroom: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCost: { type: "number", minimum: 0 },
    eligibleCost: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
  },
  required: ["grossCost", "eligibleCost", "suppliedCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cappedEligible: { type: "number" },
    unreimbursedCost: { type: "number" },
    capHeadroom: { type: "number" },
  },
  required: ["cappedEligible", "unreimbursedCost", "capHeadroom"],
} as const;
/** Administrative supplied cost/cap arithmetic without interpreting benefit eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossCost, eligibleCost, suppliedCap } = request;
  const compute = (): Output => {
    H.domain(
      grossCost >= 0 &&
        eligibleCost >= 0 &&
        eligibleCost <= grossCost &&
        suppliedCap >= 0,
    );
    return {
      cappedEligible: Math.min(eligibleCost, suppliedCap),
      unreimbursedCost: grossCost - Math.min(eligibleCost, suppliedCap),
      capHeadroom: Math.max(0, suppliedCap - eligibleCost),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossCost: 100, eligibleCost: 80, suppliedCap: 60 },
  output: { cappedEligible: 60, unreimbursedCost: 40, capHeadroom: 0 },
} satisfies ToolExample<Input, Output>;
export const pharmacyVisitCostCapGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/pharmacy-visit-cost-cap-gap",
    title: "Pharmacy Visit Cost Cap Gap Tool",
    description:
      "Administrative supplied cost/cap arithmetic without interpreting benefit eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossCost: { type: "number", minimum: 0 },
        eligibleCost: { type: "number", minimum: 0 },
        suppliedCap: { type: "number", minimum: 0 },
      },
      required: ["grossCost", "eligibleCost", "suppliedCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cappedEligible: { type: "number" },
        unreimbursedCost: { type: "number" },
        capHeadroom: { type: "number" },
      },
      required: ["cappedEligible", "unreimbursedCost", "capHeadroom"],
    },
    ports: {
      inputs: [
        {
          id: "grossCost",
          label: "Gross Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleCost",
          label: "Eligible Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cappedEligible",
          label: "Capped Eligible",
          valueType: { type: "number" },
        },
        {
          id: "unreimbursedCost",
          label: "Unreimbursed Cost",
          valueType: { type: "number" },
        },
        {
          id: "capHeadroom",
          label: "Cap Headroom",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacyVisitCostCapGapTool.execute;
export default pharmacyVisitCostCapGapTool;
