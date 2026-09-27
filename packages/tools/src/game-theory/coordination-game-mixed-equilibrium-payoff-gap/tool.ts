import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinationA: number;
  readonly coordinationB: number;
  readonly outsidePayoff: number;
};
export type Output = {
  readonly mixProbability: number;
  readonly mixedPayoff: number;
  readonly outsideGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinationA: { type: "number", exclusiveMinimum: 0 },
    coordinationB: { type: "number", exclusiveMinimum: 0 },
    outsidePayoff: { type: "number" },
  },
  required: ["coordinationA", "coordinationB", "outsidePayoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mixProbability: { type: "number" },
    mixedPayoff: { type: "number" },
    outsideGap: { type: "number" },
  },
  required: ["mixProbability", "mixedPayoff", "outsideGap"],
} as const;
/** Symmetric two-action coordination game with positive diagonal payoffs and zero mismatch payoffs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinationA, coordinationB, outsidePayoff } = request;
  const compute = (): Output => {
    H.positive(coordinationA);
    H.positive(coordinationB);
    return {
      mixProbability: coordinationB / (coordinationA + coordinationB),
      mixedPayoff:
        (coordinationA * coordinationB) / (coordinationA + coordinationB),
      outsideGap:
        (coordinationA * coordinationB) / (coordinationA + coordinationB) -
        outsidePayoff,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinationA: 4, coordinationB: 2, outsidePayoff: 1 },
  output: {
    mixProbability: 0.3333333333333333,
    mixedPayoff: 1.3333333333333333,
    outsideGap: 0.33333333333333326,
  },
} satisfies ToolExample<Input, Output>;
export const coordinationGameMixedEquilibriumPayoffGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/coordination-game-mixed-equilibrium-payoff-gap",
      title: "Coordination Game Mixed Equilibrium Payoff Gap Tool",
      description:
        "Symmetric two-action coordination game with positive diagonal payoffs and zero mismatch payoffs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coordinationA: { type: "number", exclusiveMinimum: 0 },
          coordinationB: { type: "number", exclusiveMinimum: 0 },
          outsidePayoff: { type: "number" },
        },
        required: ["coordinationA", "coordinationB", "outsidePayoff"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mixProbability: { type: "number" },
          mixedPayoff: { type: "number" },
          outsideGap: { type: "number" },
        },
        required: ["mixProbability", "mixedPayoff", "outsideGap"],
      },
      ports: {
        inputs: [
          {
            id: "coordinationA",
            label: "Coordination A",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coordinationB",
            label: "Coordination B",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "outsidePayoff",
            label: "Outside Payoff",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "mixProbability",
            label: "Mix Probability",
            valueType: { type: "number" },
          },
          {
            id: "mixedPayoff",
            label: "Mixed Payoff",
            valueType: { type: "number" },
          },
          {
            id: "outsideGap",
            label: "Outside Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = coordinationGameMixedEquilibriumPayoffGapTool.execute;
export default coordinationGameMixedEquilibriumPayoffGapTool;
