import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nernstEquationExample = {
  input: { eStandard: 1.1, electronCount: 2, reactionQuotient: 1 },
} satisfies ToolExample<{
  readonly eStandard: number;
  readonly electronCount: number;
  readonly reactionQuotient: number;
}>;

export const nernstEquationTool = createSimpleTool({
  id: "chemistry/nernst-equation",
  title: "Nernst Equation Calculator",
  description:
    "Compute cell potential as the standard potential minus 0.0592 over electron count times log10 of the reaction quotient.",
  inputs: [
    {
      id: "eStandard",
      label: "Standard cell potential",
      kind: "number",
      unit: "V",
    },
    {
      id: "electronCount",
      label: "Electrons transferred",
      kind: "integer",
      minimum: 1,
    },
    { id: "reactionQuotient", label: "Reaction quotient Q", kind: "number" },
  ],
  outputs: [
    {
      id: "cellPotentialVolts",
      label: "Cell potential",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const eStandard = input.eStandard as number;
    const electronCount = input.electronCount as number;
    const reactionQuotient = input.reactionQuotient as number;
    if (!(reactionQuotient > 0))
      simpleError("reactionQuotient", "Reaction quotient must be positive.");
    return {
      cellPotentialVolts:
        eStandard - (0.0592 / electronCount) * Math.log10(reactionQuotient),
    };
  },
});
export const runNernstEquation = nernstEquationTool.execute;
export default nernstEquationTool;
