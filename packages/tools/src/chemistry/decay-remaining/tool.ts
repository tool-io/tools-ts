import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const decayRemainingTool = createSimpleTool({
  id: "chemistry/decay-remaining",
  title: "Decay Remaining Calculator",
  description:
    "Compute the remaining amount after radioactive decay as N = N₀·(1/2)^(t/t½).",
  inputs: [
    {
      description: "Starting amount N₀.",
      id: "initialAmount",
      label: "Initial amount",
      kind: "number",
    },
    {
      description:
        "Half-life of the decaying substance; must be greater than zero.",
      id: "halfLife",
      label: "Half-life",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      description: "Elapsed time.",
      id: "elapsed",
      label: "Elapsed time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Amount remaining.",
      id: "remaining",
      label: "Remaining amount",
      kind: "number",
    },
    {
      description: "Remaining fraction of the initial amount.",
      id: "fractionRemaining",
      label: "Fraction remaining",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const halfLife = input.halfLife as number;
    if (halfLife <= 0)
      simpleError(
        "halfLife",
        "The half-life must be greater than zero.",
        "invalid_half_life",
      );
    const fractionRemaining = (1 / 2) ** ((input.elapsed as number) / halfLife);
    return {
      fractionRemaining,
      remaining: (input.initialAmount as number) * fractionRemaining,
    };
  },
});
export const runDecayRemaining = decayRemainingTool.execute;
export default decayRemainingTool;

export type DecayRemainingInput = {
  readonly initialAmount: number;
  readonly halfLife: number;
  readonly elapsed: number;
};

export type DecayRemainingOutput = {
  readonly remaining: number;
  readonly fractionRemaining: number;
};

export const decayRemainingExample = {
  input: {
    initialAmount: 1,
    halfLife: 1,
    elapsed: 1,
  },
  output: {
    fractionRemaining: 0.5,
    remaining: 0.5,
  },
} satisfies ToolExample<DecayRemainingInput, DecayRemainingOutput>;
