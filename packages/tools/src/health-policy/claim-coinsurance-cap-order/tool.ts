import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleAmount: number;
  readonly memberFraction: number;
  readonly capAmount: number;
  readonly capBeforeShare: boolean;
};
export type Output = { readonly memberAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleAmount: { type: "number", minimum: 0 },
    memberFraction: { type: "number", minimum: 0, maximum: 1 },
    capAmount: { type: "number", minimum: 0 },
    capBeforeShare: { type: "boolean" },
  },
  required: ["eligibleAmount", "memberFraction", "capAmount", "capBeforeShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { memberAmount: { type: "number" } },
  required: ["memberAmount"],
} as const;
/** Compare two explicitly supplied cap-order conventions, without determining policy benefits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleAmount, memberFraction, capAmount, capBeforeShare } = request;
  const compute = (): Output => {
    H.domain(eligibleAmount >= 0 && capAmount >= 0);
    H.probability(memberFraction);
    return {
      memberAmount: capBeforeShare
        ? Math.min(eligibleAmount, capAmount) * memberFraction
        : Math.min(eligibleAmount * memberFraction, capAmount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleAmount: 1000,
    memberFraction: 0.2,
    capAmount: 100,
    capBeforeShare: true,
  },
  output: { memberAmount: 20 },
} satisfies ToolExample<Input, Output>;
export const claimCoinsuranceCapOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/claim-coinsurance-cap-order",
    title: "Claim Coinsurance Cap Order Tool",
    description:
      "Compare two explicitly supplied cap-order conventions, without determining policy benefits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleAmount: { type: "number", minimum: 0 },
        memberFraction: { type: "number", minimum: 0, maximum: 1 },
        capAmount: { type: "number", minimum: 0 },
        capBeforeShare: { type: "boolean" },
      },
      required: [
        "eligibleAmount",
        "memberFraction",
        "capAmount",
        "capBeforeShare",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { memberAmount: { type: "number" } },
      required: ["memberAmount"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleAmount",
          label: "Eligible Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "memberFraction",
          label: "Member Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capAmount",
          label: "Cap Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capBeforeShare",
          label: "Cap Before Share",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "memberAmount",
          label: "Member Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = claimCoinsuranceCapOrderTool.execute;
export default claimCoinsuranceCapOrderTool;
