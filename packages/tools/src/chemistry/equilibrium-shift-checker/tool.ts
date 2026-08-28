import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const equilibriumShiftCheckerTool = createSimpleTool({
  id: "chemistry/equilibrium-shift-checker",
  title: "Equilibrium Shift Checker",
  description:
    "Compare the reaction quotient Q against the equilibrium constant K to determine the direction of shift.",
  inputs: [
    {
      description: "Reaction quotient Q computed from current conditions.",
      id: "quotient",
      label: "Q",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Equilibrium constant K.",
      id: "k",
      label: "K",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Direction the reaction proceeds: toward reactants, toward products, or no change.",
      id: "shift",
      label: "Shift direction",
      kind: "string",
    },
  ],
  calculate: (input) => {
    const q = input.quotient as number;
    const k = input.k as number;
    if (!(k > 0))
      simpleError("k", "Equilibrium constant must be greater than zero.");
    const shift =
      q > k ? "toward reactants" : q === k ? "no change" : "toward products";
    return { shift };
  },
});
export const runEquilibriumShiftChecker = equilibriumShiftCheckerTool.execute;
export default equilibriumShiftCheckerTool;

export type EquilibriumShiftCheckerInput = {
  readonly quotient: number;
  readonly k: number;
};

export type EquilibriumShiftCheckerOutput = {
  readonly shift: string;
};

export const equilibriumShiftCheckerExample = {
  input: {
    quotient: 1,
    k: 1,
  },
  output: {
    shift: "no change",
  },
} satisfies ToolExample<
  EquilibriumShiftCheckerInput,
  EquilibriumShiftCheckerOutput
>;
