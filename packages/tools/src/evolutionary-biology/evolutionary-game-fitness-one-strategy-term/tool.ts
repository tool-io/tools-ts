import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payoffs: readonly number[];
  readonly opponentFrequencies: readonly number[];
  readonly baselineFitness: number;
  readonly selectionIntensity: number;
};
export type Output = {
  readonly expectedPayoff: number;
  readonly fitness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payoffs: { type: "array", maxItems: 256, items: { type: "number" } },
    opponentFrequencies: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    baselineFitness: { type: "number" },
    selectionIntensity: { type: "number" },
  },
  required: [
    "payoffs",
    "opponentFrequencies",
    "baselineFitness",
    "selectionIntensity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedPayoff: { type: "number" },
    fitness: { type: "number" },
  },
  required: ["expectedPayoff", "fitness"],
} as const;
/** Expected strategy payoff against supplied normalized frequencies and an explicit affine payoff-to-fitness mapping. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payoffs, opponentFrequencies, baselineFitness, selectionIntensity } =
    request;
  const compute = (): Output => {
    H.domain(
      baselineFitness +
        selectionIntensity * H.dot(payoffs, opponentFrequencies) >=
        0,
    );
    H.sameLength(payoffs, opponentFrequencies);
    H.domain(
      payoffs.length > 0 &&
        opponentFrequencies.every((x) => x >= 0) &&
        Math.abs(opponentFrequencies.reduce((a, b) => a + b, 0) - 1) <= 1e-12,
    );
    return {
      expectedPayoff: H.dot(payoffs, opponentFrequencies),
      fitness:
        baselineFitness +
        selectionIntensity * H.dot(payoffs, opponentFrequencies),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    payoffs: [4, 1],
    opponentFrequencies: [0.25, 0.75],
    baselineFitness: 1,
    selectionIntensity: 0.5,
  },
  output: { expectedPayoff: 1.75, fitness: 1.875 },
} satisfies ToolExample<Input, Output>;
export const evolutionaryGameFitnessOneStrategyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "evolutionary-biology/evolutionary-game-fitness-one-strategy-term",
      title: "Evolutionary Game Fitness One Strategy Term Tool",
      description:
        "Expected strategy payoff against supplied normalized frequencies and an explicit affine payoff-to-fitness mapping.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          payoffs: { type: "array", maxItems: 256, items: { type: "number" } },
          opponentFrequencies: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          baselineFitness: { type: "number" },
          selectionIntensity: { type: "number" },
        },
        required: [
          "payoffs",
          "opponentFrequencies",
          "baselineFitness",
          "selectionIntensity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedPayoff: { type: "number" },
          fitness: { type: "number" },
        },
        required: ["expectedPayoff", "fitness"],
      },
      ports: {
        inputs: [
          {
            id: "payoffs",
            label: "Payoffs",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "opponentFrequencies",
            label: "Opponent Frequencies",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "baselineFitness",
            label: "Baseline Fitness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "selectionIntensity",
            label: "Selection Intensity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expectedPayoff",
            label: "Expected Payoff",
            valueType: { type: "number" },
          },
          { id: "fitness", label: "Fitness", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = evolutionaryGameFitnessOneStrategyTermTool.execute;
export default evolutionaryGameFitnessOneStrategyTermTool;
