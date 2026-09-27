import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly equilibriumPayoff: number;
  readonly deviationPayoff: number;
  readonly probabilityOthers: number;
};
export type Output = {
  readonly weightedGain: number;
  readonly obedienceSlack: number;
  readonly profitable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equilibriumPayoff: { type: "number" },
    deviationPayoff: { type: "number" },
    probabilityOthers: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["equilibriumPayoff", "deviationPayoff", "probabilityOthers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedGain: { type: "number" },
    obedienceSlack: { type: "number" },
    profitable: { type: "boolean" },
  },
  required: ["weightedGain", "obedienceSlack", "profitable"],
} as const;
/** One weighted unilateral-deviation contribution, which alone does not establish Nash equilibrium. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { equilibriumPayoff, deviationPayoff, probabilityOthers } = request;
  const compute = (): Output => {
    H.probability(probabilityOthers);
    return {
      weightedGain: probabilityOthers * (deviationPayoff - equilibriumPayoff),
      obedienceSlack: probabilityOthers * (equilibriumPayoff - deviationPayoff),
      profitable: probabilityOthers > 0 && deviationPayoff > equilibriumPayoff,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { equilibriumPayoff: 3, deviationPayoff: 5, probabilityOthers: 0.25 },
  output: { weightedGain: 0.5, obedienceSlack: -0.5, profitable: true },
} satisfies ToolExample<Input, Output>;
export const nashDeviationOnePlayerSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/nash-deviation-one-player-slack",
    title: "Nash Deviation One Player Slack Tool",
    description:
      "One weighted unilateral-deviation contribution, which alone does not establish Nash equilibrium.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equilibriumPayoff: { type: "number" },
        deviationPayoff: { type: "number" },
        probabilityOthers: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["equilibriumPayoff", "deviationPayoff", "probabilityOthers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedGain: { type: "number" },
        obedienceSlack: { type: "number" },
        profitable: { type: "boolean" },
      },
      required: ["weightedGain", "obedienceSlack", "profitable"],
    },
    ports: {
      inputs: [
        {
          id: "equilibriumPayoff",
          label: "Equilibrium Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deviationPayoff",
          label: "Deviation Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "probabilityOthers",
          label: "Probability Others",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedGain",
          label: "Weighted Gain",
          valueType: { type: "number" },
        },
        {
          id: "obedienceSlack",
          label: "Obedience Slack",
          valueType: { type: "number" },
        },
        {
          id: "profitable",
          label: "Profitable",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = nashDeviationOnePlayerSlackTool.execute;
export default nashDeviationOnePlayerSlackTool;
