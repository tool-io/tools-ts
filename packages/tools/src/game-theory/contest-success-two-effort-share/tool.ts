import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ownEffort: number;
  readonly rivalEffort: number;
  readonly exponent: number;
  readonly prize: number;
  readonly cost: number;
};
export type Output = {
  readonly winProbability: number;
  readonly expectedPayoff: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ownEffort: { type: "number", minimum: 0 },
    rivalEffort: { type: "number", minimum: 0 },
    exponent: { type: "number", exclusiveMinimum: 0 },
    prize: { type: "number" },
    cost: { type: "number", minimum: 0 },
  },
  required: ["ownEffort", "rivalEffort", "exponent", "prize", "cost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    winProbability: { type: "number" },
    expectedPayoff: { type: "number" },
  },
  required: ["winProbability", "expectedPayoff"],
} as const;
/** Two-player Tullock contest success function; a zero-versus-zero contest is undefined and rejected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ownEffort, rivalEffort, exponent, prize, cost } = request;
  const compute = (): Output => {
    H.domain(
      ownEffort >= 0 &&
        rivalEffort >= 0 &&
        ownEffort + rivalEffort > 0 &&
        cost >= 0,
    );
    H.positive(exponent);
    return {
      winProbability:
        ownEffort ** exponent /
        (ownEffort ** exponent + rivalEffort ** exponent),
      expectedPayoff:
        (prize * ownEffort ** exponent) /
          (ownEffort ** exponent + rivalEffort ** exponent) -
        cost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ownEffort: 2, rivalEffort: 2, exponent: 1, prize: 100, cost: 20 },
  output: { winProbability: 0.5, expectedPayoff: 30 },
} satisfies ToolExample<Input, Output>;
export const contestSuccessTwoEffortShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/contest-success-two-effort-share",
    title: "Contest Success Two Effort Share Tool",
    description:
      "Two-player Tullock contest success function; a zero-versus-zero contest is undefined and rejected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ownEffort: { type: "number", minimum: 0 },
        rivalEffort: { type: "number", minimum: 0 },
        exponent: { type: "number", exclusiveMinimum: 0 },
        prize: { type: "number" },
        cost: { type: "number", minimum: 0 },
      },
      required: ["ownEffort", "rivalEffort", "exponent", "prize", "cost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        winProbability: { type: "number" },
        expectedPayoff: { type: "number" },
      },
      required: ["winProbability", "expectedPayoff"],
    },
    ports: {
      inputs: [
        {
          id: "ownEffort",
          label: "Own Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rivalEffort",
          label: "Rival Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "prize",
          label: "Prize",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cost",
          label: "Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "winProbability",
          label: "Win Probability",
          valueType: { type: "number" },
        },
        {
          id: "expectedPayoff",
          label: "Expected Payoff",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = contestSuccessTwoEffortShareTool.execute;
export default contestSuccessTwoEffortShareTool;
