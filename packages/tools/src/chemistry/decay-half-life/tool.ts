import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const decayHalfLifeTool = createSimpleTool({
  id: "chemistry/decay-half-life",
  title: "Decay Half-Life Calculator",
  description:
    "Solve the half-life from an initial amount, a remaining amount, and the elapsed time as t½ = t·ln2 / ln(N₀/N).",
  inputs: [
    {
      description: "Starting amount N₀.",
      id: "initialAmount",
      label: "Initial amount",
      kind: "number",
    },
    {
      description: "Amount remaining after the elapsed time.",
      id: "remainingAmount",
      label: "Remaining amount",
      kind: "number",
    },
    {
      description: "Elapsed decay time; must be greater than zero.",
      id: "elapsedTime",
      label: "Elapsed time",
      kind: "number",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Computed half-life.",
      id: "halfLife",
      label: "Half-life",
      kind: "number",
      unit: "s",
    },
  ],
  calculate: (input) => {
    const initial = input.initialAmount as number;
    const remaining = input.remainingAmount as number;
    if (
      initial <= 0 ||
      remaining <= 0 ||
      remaining >= initial ||
      (input.elapsedTime as number) <= 0
    )
      simpleError(
        "remainingAmount",
        "Require remaining amount strictly between zero and the initial amount and positive time.",
        "invalid_decay_input",
      );
    return {
      halfLife:
        ((input.elapsedTime as number) * Math.LN2) /
        Math.log(initial / remaining),
    };
  },
});
export const runDecayHalfLife = decayHalfLifeTool.execute;
export default decayHalfLifeTool;

export type DecayHalfLifeInput = {
  readonly initialAmount: number;
  readonly remainingAmount: number;
  readonly elapsedTime: number;
};

export type DecayHalfLifeOutput = {
  readonly halfLife: number;
};

export const decayHalfLifeExample = {
  input: {
    initialAmount: 1,
    remainingAmount: 0.5,
    elapsedTime: 1,
  },
  output: {
    halfLife: 1,
  },
} satisfies ToolExample<DecayHalfLifeInput, DecayHalfLifeOutput>;
