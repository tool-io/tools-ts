import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basePayoff: number;
  readonly bonusIfEligible: number;
  readonly bonusEligible: boolean;
};
export type Output = { readonly realizedAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePayoff: { type: "number" },
    bonusIfEligible: { type: "number" },
    bonusEligible: { type: "boolean" },
  },
  required: ["basePayoff", "bonusIfEligible", "bonusEligible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { realizedAmount: { type: "number" } },
  required: ["realizedAmount"],
} as const;
/** Apply an explicit trial bonus flag to a supplied base payoff without inferring eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basePayoff, bonusIfEligible, bonusEligible } = request;
  const compute = (): Output => {
    return {
      realizedAmount: basePayoff + (bonusEligible ? bonusIfEligible : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { basePayoff: 2, bonusIfEligible: 0.5, bonusEligible: true },
  output: { realizedAmount: 2.5 },
} satisfies ToolExample<Input, Output>;
export const trialPayoffRealizedAmountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "experimental-psychology",
        "experimental psychology",
        "psychology",
      ],
      keywords: ["experimental psychology", "psychology"],
    },
    id: "experimental-psychology/trial-payoff-realized-amount",
    title: "Trial Payoff Realized Amount",
    description:
      "Apply an explicit trial bonus flag to a supplied base payoff without inferring eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basePayoff: { type: "number" },
        bonusIfEligible: { type: "number" },
        bonusEligible: { type: "boolean" },
      },
      required: ["basePayoff", "bonusIfEligible", "bonusEligible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { realizedAmount: { type: "number" } },
      required: ["realizedAmount"],
    },
    ports: {
      inputs: [
        {
          id: "basePayoff",
          label: "Base Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bonusIfEligible",
          label: "Bonus If Eligible",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bonusEligible",
          label: "Bonus Eligible",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "realizedAmount",
          label: "Realized Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialPayoffRealizedAmountTool.execute;
export default trialPayoffRealizedAmountTool;
