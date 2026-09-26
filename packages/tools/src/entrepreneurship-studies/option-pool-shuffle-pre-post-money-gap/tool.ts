import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly existingShares: number;
  readonly investment: number;
  readonly preMoney: number;
  readonly targetPostPoolFraction: number;
  readonly existingPoolShares: number;
};
export type Output = {
  readonly newPoolShares: number;
  readonly investorShares: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    existingShares: { type: "number", exclusiveMinimum: 0 },
    investment: { type: "number", minimum: 0 },
    preMoney: { type: "number", exclusiveMinimum: 0 },
    targetPostPoolFraction: { type: "number", minimum: 0, maximum: 1 },
    existingPoolShares: { type: "number", minimum: 0 },
  },
  required: [
    "existingShares",
    "investment",
    "preMoney",
    "targetPostPoolFraction",
    "existingPoolShares",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newPoolShares: { type: "number" },
    investorShares: { type: "number" },
  },
  required: ["newPoolShares", "investorShares"],
} as const;
/** Pre-money pool top-up solving a specified post-round pool fraction; existingShares includes the existing pool and investment is primary capital. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    existingShares,
    investment,
    preMoney,
    targetPostPoolFraction,
    existingPoolShares,
  } = request;
  const compute = (): Output => {
    H.positive(existingShares);
    H.positive(preMoney);
    H.domain(
      investment >= 0 &&
        existingPoolShares >= 0 &&
        existingPoolShares <= existingShares,
    );
    H.probability(targetPostPoolFraction);
    const ratio = investment / preMoney;
    H.domain(
      targetPostPoolFraction * (1 + ratio) < 1 &&
        targetPostPoolFraction * (1 + ratio) * existingShares >=
          existingPoolShares,
    );
    const newPoolShares =
      (targetPostPoolFraction * (1 + ratio) * existingShares -
        existingPoolShares) /
      (1 - targetPostPoolFraction * (1 + ratio));
    return {
      newPoolShares,
      investorShares: (existingShares + newPoolShares) * ratio,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    existingShares: 1000,
    investment: 200,
    preMoney: 800,
    targetPostPoolFraction: 0.2,
    existingPoolShares: 0,
  },
  output: {
    newPoolShares: 333.3333333333333,
    investorShares: 333.3333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const optionPoolShufflePrePostMoneyGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/option-pool-shuffle-pre-post-money-gap",
    title: "Option Pool Shuffle Pre Post Money Gap Tool",
    description:
      "Pre-money pool top-up solving a specified post-round pool fraction; existingShares includes the existing pool and investment is primary capital.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        existingShares: { type: "number", exclusiveMinimum: 0 },
        investment: { type: "number", minimum: 0 },
        preMoney: { type: "number", exclusiveMinimum: 0 },
        targetPostPoolFraction: { type: "number", minimum: 0, maximum: 1 },
        existingPoolShares: { type: "number", minimum: 0 },
      },
      required: [
        "existingShares",
        "investment",
        "preMoney",
        "targetPostPoolFraction",
        "existingPoolShares",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newPoolShares: { type: "number" },
        investorShares: { type: "number" },
      },
      required: ["newPoolShares", "investorShares"],
    },
    ports: {
      inputs: [
        {
          id: "existingShares",
          label: "Existing Shares",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "investment",
          label: "Investment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preMoney",
          label: "Pre Money",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetPostPoolFraction",
          label: "Target Post Pool Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "existingPoolShares",
          label: "Existing Pool Shares",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newPoolShares",
          label: "New Pool Shares",
          valueType: { type: "number" },
        },
        {
          id: "investorShares",
          label: "Investor Shares",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = optionPoolShufflePrePostMoneyGapTool.execute;
export default optionPoolShufflePrePostMoneyGapTool;
