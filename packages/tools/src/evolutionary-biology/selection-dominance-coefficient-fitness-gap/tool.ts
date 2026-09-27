import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly selectionCoefficient: number;
  readonly dominance: number;
};
export type Output = {
  readonly fitnessAA: number;
  readonly fitnessAa: number;
  readonly fitnessaa: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectionCoefficient: { type: "number" },
    dominance: { type: "number" },
  },
  required: ["selectionCoefficient", "dominance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fitnessAA: { type: "number" },
    fitnessAa: { type: "number" },
    fitnessaa: { type: "number" },
  },
  required: ["fitnessAA", "fitnessAa", "fitnessaa"],
} as const;
/** Relative viabilities wAA=1, wAa=1-hs, waa=1-s; overdominance and beneficial negative s remain allowed if fitnesses are nonnegative. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { selectionCoefficient, dominance } = request;
  const compute = (): Output => {
    H.domain(
      1 - selectionCoefficient >= 0 &&
        1 - dominance * selectionCoefficient >= 0,
    );
    return {
      fitnessAA: 1,
      fitnessAa: 1 - dominance * selectionCoefficient,
      fitnessaa: 1 - selectionCoefficient,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { selectionCoefficient: 0.2, dominance: 0.5 },
  output: { fitnessAA: 1, fitnessAa: 0.9, fitnessaa: 0.8 },
} satisfies ToolExample<Input, Output>;
export const selectionDominanceCoefficientFitnessGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "evolutionary-biology/selection-dominance-coefficient-fitness-gap",
      title: "Selection Dominance Coefficient Fitness Gap Tool",
      description:
        "Relative viabilities wAA=1, wAa=1-hs, waa=1-s; overdominance and beneficial negative s remain allowed if fitnesses are nonnegative.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          selectionCoefficient: { type: "number" },
          dominance: { type: "number" },
        },
        required: ["selectionCoefficient", "dominance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fitnessAA: { type: "number" },
          fitnessAa: { type: "number" },
          fitnessaa: { type: "number" },
        },
        required: ["fitnessAA", "fitnessAa", "fitnessaa"],
      },
      ports: {
        inputs: [
          {
            id: "selectionCoefficient",
            label: "Selection Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dominance",
            label: "Dominance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fitnessAA",
            label: "Fitness AA",
            valueType: { type: "number" },
          },
          {
            id: "fitnessAa",
            label: "Fitness Aa",
            valueType: { type: "number" },
          },
          {
            id: "fitnessaa",
            label: "Fitnessaa",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = selectionDominanceCoefficientFitnessGapTool.execute;
export default selectionDominanceCoefficientFitnessGapTool;
