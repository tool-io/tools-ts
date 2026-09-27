import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly statePrice: number;
  readonly discountFactor: number;
  readonly statePayoff: number;
};
export type Output = {
  readonly riskNeutralProbability: number;
  readonly presentValueContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statePrice: { type: "number", minimum: 0 },
    discountFactor: { type: "number", exclusiveMinimum: 0 },
    statePayoff: { type: "number" },
  },
  required: ["statePrice", "discountFactor", "statePayoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    riskNeutralProbability: { type: "number" },
    presentValueContribution: { type: "number" },
  },
  required: ["riskNeutralProbability", "presentValueContribution"],
} as const;
/** One Arrow state-price probability and payoff PV term; all state prices would need to sum to the discount factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { statePrice, discountFactor, statePayoff } = request;
  const compute = (): Output => {
    H.positive(discountFactor);
    H.domain(statePrice >= 0 && statePrice <= discountFactor);
    return {
      riskNeutralProbability: statePrice / discountFactor,
      presentValueContribution: statePrice * statePayoff,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { statePrice: 0.4, discountFactor: 0.8, statePayoff: 100 },
  output: { riskNeutralProbability: 0.5, presentValueContribution: 40 },
} satisfies ToolExample<Input, Output>;
export const riskNeutralOneStatePriceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/risk-neutral-one-state-price-term",
    title: "Risk Neutral One State Price Term Tool",
    description:
      "One Arrow state-price probability and payoff PV term; all state prices would need to sum to the discount factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        statePrice: { type: "number", minimum: 0 },
        discountFactor: { type: "number", exclusiveMinimum: 0 },
        statePayoff: { type: "number" },
      },
      required: ["statePrice", "discountFactor", "statePayoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        riskNeutralProbability: { type: "number" },
        presentValueContribution: { type: "number" },
      },
      required: ["riskNeutralProbability", "presentValueContribution"],
    },
    ports: {
      inputs: [
        {
          id: "statePrice",
          label: "State Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discountFactor",
          label: "Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "statePayoff",
          label: "State Payoff",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "riskNeutralProbability",
          label: "Risk Neutral Probability",
          valueType: { type: "number" },
        },
        {
          id: "presentValueContribution",
          label: "Present Value Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = riskNeutralOneStatePriceTermTool.execute;
export default riskNeutralOneStatePriceTermTool;
