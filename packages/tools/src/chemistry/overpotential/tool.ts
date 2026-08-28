import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const OverpotentialTool = createSimpleTool({
  id: "chemistry/overpotential",
  title: "Overpotential Calculator",
  description:
    "Compute signed electrode overpotential eta = E_applied - E_equilibrium on the same reference-electrode scale.",
  inputs: [
    {
      id: "equilibriumPotentialV",
      label: "Eq potential",
      kind: "number",
      unit: "V",
    },
    {
      id: "appliedPotentialV",
      label: "Applied potential",
      kind: "number",
      unit: "V",
    },
  ],
  outputs: [
    { id: "overpotentialV", label: "Overpotential", kind: "number", unit: "V" },
  ],
  calculate: (input) => {
    return {
      overpotentialV:
        (input.appliedPotentialV as number) -
        (input.equilibriumPotentialV as number),
    };
  },
});
export default OverpotentialTool;
export const runOverpotential = OverpotentialTool.execute;

export type OverpotentialInput = {
  readonly equilibriumPotentialV: number;
  readonly appliedPotentialV: number;
};

export type OverpotentialOutput = {
  readonly overpotentialV: number;
};

export const overpotentialExample = {
  input: {
    equilibriumPotentialV: 1,
    appliedPotentialV: 1,
  },
  output: {
    overpotentialV: 0,
  },
} satisfies ToolExample<OverpotentialInput, OverpotentialOutput>;
