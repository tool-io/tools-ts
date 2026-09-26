import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preMoney: number;
  readonly newInvestment: number;
};
export type Output = {
  readonly postMoney: number;
  readonly retainedFactor: number;
  readonly newInvestorShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preMoney: { type: "number", exclusiveMinimum: 0 },
    newInvestment: { type: "number", minimum: 0 },
  },
  required: ["preMoney", "newInvestment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    postMoney: { type: "number" },
    retainedFactor: { type: "number" },
    newInvestorShare: { type: "number" },
  },
  required: ["postMoney", "retainedFactor", "newInvestorShare"],
} as const;
/** Compute a simple primary equity round from explicit values without option pools, fees or convertible instruments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preMoney, newInvestment } = request;
  const compute = (): Output => {
    H.positive(preMoney);
    H.domain(newInvestment >= 0);
    return {
      postMoney: preMoney + newInvestment,
      retainedFactor: preMoney / (preMoney + newInvestment),
      newInvestorShare: newInvestment / (preMoney + newInvestment),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preMoney: 800, newInvestment: 200 },
  output: { postMoney: 1000, retainedFactor: 0.8, newInvestorShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const fundingRoundOwnershipFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/funding-round-ownership-factor",
    title: "Funding Round Ownership Factor Tool",
    description:
      "Compute a simple primary equity round from explicit values without option pools, fees or convertible instruments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preMoney: { type: "number", exclusiveMinimum: 0 },
        newInvestment: { type: "number", minimum: 0 },
      },
      required: ["preMoney", "newInvestment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        postMoney: { type: "number" },
        retainedFactor: { type: "number" },
        newInvestorShare: { type: "number" },
      },
      required: ["postMoney", "retainedFactor", "newInvestorShare"],
    },
    ports: {
      inputs: [
        {
          id: "preMoney",
          label: "Pre Money",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newInvestment",
          label: "New Investment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "postMoney", label: "Post Money", valueType: { type: "number" } },
        {
          id: "retainedFactor",
          label: "Retained Factor",
          valueType: { type: "number" },
        },
        {
          id: "newInvestorShare",
          label: "New Investor Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fundingRoundOwnershipFactorTool.execute;
export default fundingRoundOwnershipFactorTool;
