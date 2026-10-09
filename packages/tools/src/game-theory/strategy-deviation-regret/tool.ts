import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly realizedPayoff: number;
  readonly deviationPayoff: number;
};
export type Output = {
  readonly signedGain: number;
  readonly positiveRegret: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    realizedPayoff: { type: "number" },
    deviationPayoff: { type: "number" },
  },
  required: ["realizedPayoff", "deviationPayoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGain: { type: "number" },
    positiveRegret: { type: "number" },
  },
  required: ["signedGain", "positiveRegret"],
} as const;
/** Compare one supplied deviation payoff with a realized payoff without solving an equilibrium. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { realizedPayoff, deviationPayoff } = request;
  const compute = (): Output => {
    return {
      signedGain: deviationPayoff - realizedPayoff,
      positiveRegret: Math.max(0, deviationPayoff - realizedPayoff),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { realizedPayoff: 4, deviationPayoff: 7 },
  output: { signedGain: 3, positiveRegret: 3 },
} satisfies ToolExample<Input, Output>;
export const strategyDeviationRegretTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["game-theory", "game theory", "economics"],
      keywords: ["game theory", "economics"],
    },
    id: "game-theory/strategy-deviation-regret",
    title: "Strategy Deviation Regret",
    description:
      "Compare one supplied deviation payoff with a realized payoff without solving an equilibrium.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        realizedPayoff: { type: "number" },
        deviationPayoff: { type: "number" },
      },
      required: ["realizedPayoff", "deviationPayoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGain: { type: "number" },
        positiveRegret: { type: "number" },
      },
      required: ["signedGain", "positiveRegret"],
    },
    ports: {
      inputs: [
        {
          id: "realizedPayoff",
          label: "Realized Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deviationPayoff",
          label: "Deviation Payoff",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedGain",
          label: "Signed Gain",
          valueType: { type: "number" },
        },
        {
          id: "positiveRegret",
          label: "Positive Regret",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = strategyDeviationRegretTool.execute;
export default strategyDeviationRegretTool;
