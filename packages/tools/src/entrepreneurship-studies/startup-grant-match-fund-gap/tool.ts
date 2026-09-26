import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleCost: number;
  readonly grantFraction: number;
  readonly grantCap: number;
  readonly availableOwnFunds: number;
};
export type Output = {
  readonly grant: number;
  readonly requiredMatch: number;
  readonly fundingGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCost: { type: "number", minimum: 0 },
    grantFraction: { type: "number", minimum: 0, maximum: 1 },
    grantCap: { type: "number", minimum: 0 },
    availableOwnFunds: { type: "number", minimum: 0 },
  },
  required: ["eligibleCost", "grantFraction", "grantCap", "availableOwnFunds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grant: { type: "number" },
    requiredMatch: { type: "number" },
    fundingGap: { type: "number" },
  },
  required: ["grant", "requiredMatch", "fundingGap"],
} as const;
/** Calculate startup grant match fund gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleCost, grantFraction, grantCap, availableOwnFunds } = request;
  const compute = (): Output => {
    H.domain(eligibleCost >= 0 && grantCap >= 0 && availableOwnFunds >= 0);
    H.probability(grantFraction);
    return {
      grant: Math.min(eligibleCost * grantFraction, grantCap),
      requiredMatch:
        eligibleCost - Math.min(eligibleCost * grantFraction, grantCap),
      fundingGap: Math.max(
        0,
        eligibleCost -
          Math.min(eligibleCost * grantFraction, grantCap) -
          availableOwnFunds,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleCost: 100000,
    grantFraction: 0.6,
    grantCap: 50000,
    availableOwnFunds: 30000,
  },
  output: { grant: 50000, requiredMatch: 50000, fundingGap: 20000 },
} satisfies ToolExample<Input, Output>;
export const startupGrantMatchFundGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/startup-grant-match-fund-gap",
    title: "Startup Grant Match Fund Gap Tool",
    description:
      "Calculate startup grant match fund gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCost: { type: "number", minimum: 0 },
        grantFraction: { type: "number", minimum: 0, maximum: 1 },
        grantCap: { type: "number", minimum: 0 },
        availableOwnFunds: { type: "number", minimum: 0 },
      },
      required: [
        "eligibleCost",
        "grantFraction",
        "grantCap",
        "availableOwnFunds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grant: { type: "number" },
        requiredMatch: { type: "number" },
        fundingGap: { type: "number" },
      },
      required: ["grant", "requiredMatch", "fundingGap"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleCost",
          label: "Eligible Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grantFraction",
          label: "Grant Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grantCap",
          label: "Grant Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableOwnFunds",
          label: "Available Own Funds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grant", label: "Grant", valueType: { type: "number" } },
        {
          id: "requiredMatch",
          label: "Required Match",
          valueType: { type: "number" },
        },
        {
          id: "fundingGap",
          label: "Funding Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = startupGrantMatchFundGapTool.execute;
export default startupGrantMatchFundGapTool;
