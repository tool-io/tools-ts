import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleCost: number;
  readonly requiredMatchFraction: number;
  readonly availableMatch: number;
};
export type Output = {
  readonly requiredMatch: number;
  readonly headroom: number;
  readonly fundingGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCost: { type: "number", minimum: 0 },
    requiredMatchFraction: { type: "number", minimum: 0, maximum: 1 },
    availableMatch: { type: "number", minimum: 0 },
  },
  required: ["eligibleCost", "requiredMatchFraction", "availableMatch"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredMatch: { type: "number" },
    headroom: { type: "number" },
    fundingGap: { type: "number" },
  },
  required: ["requiredMatch", "headroom", "fundingGap"],
} as const;
/** Calculate rural grant match fund headroom term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleCost, requiredMatchFraction, availableMatch } = request;
  const compute = (): Output => {
    H.domain(eligibleCost >= 0 && availableMatch >= 0);
    H.probability(requiredMatchFraction);
    return {
      requiredMatch: eligibleCost * requiredMatchFraction,
      headroom: availableMatch - eligibleCost * requiredMatchFraction,
      fundingGap: Math.max(
        0,
        eligibleCost * requiredMatchFraction - availableMatch,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleCost: 1000,
    requiredMatchFraction: 0.2,
    availableMatch: 250,
  },
  output: { requiredMatch: 200, headroom: 50, fundingGap: 0 },
} satisfies ToolExample<Input, Output>;
export const ruralGrantMatchFundHeadroomTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/rural-grant-match-fund-headroom-term",
    title: "Rural Grant Match Fund Headroom Term Tool",
    description:
      "Calculate rural grant match fund headroom term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCost: { type: "number", minimum: 0 },
        requiredMatchFraction: { type: "number", minimum: 0, maximum: 1 },
        availableMatch: { type: "number", minimum: 0 },
      },
      required: ["eligibleCost", "requiredMatchFraction", "availableMatch"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredMatch: { type: "number" },
        headroom: { type: "number" },
        fundingGap: { type: "number" },
      },
      required: ["requiredMatch", "headroom", "fundingGap"],
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
          id: "requiredMatchFraction",
          label: "Required Match Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "availableMatch",
          label: "Available Match",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredMatch",
          label: "Required Match",
          valueType: { type: "number" },
        },
        { id: "headroom", label: "Headroom", valueType: { type: "number" } },
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
export const run = ruralGrantMatchFundHeadroomTermTool.execute;
export default ruralGrantMatchFundHeadroomTermTool;
