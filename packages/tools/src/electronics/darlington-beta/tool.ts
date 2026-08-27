import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DarlingtonBetaInput = {
  readonly betaOneInt: number;
  readonly betaTwoInt: number;
};

export type DarlingtonBetaOutput = {
  readonly darlingtonBeta: number;
};

export const darlingtonBetaExample = {
  input: { betaOneInt: 100, betaTwoInt: 50 },
  output: { darlingtonBeta: 5000 },
} satisfies ToolExample<DarlingtonBetaInput, DarlingtonBetaOutput>;

export const calculateDarlingtonBeta = (
  input: DarlingtonBetaInput,
): DarlingtonBetaOutput => ({
  darlingtonBeta: input.betaOneInt * input.betaTwoInt,
});

export const darlingtonBetaTool = createSimpleTool({
  calculate: (input) =>
    calculateDarlingtonBeta(input as unknown as DarlingtonBetaInput),
  description:
    "Compute the Darlington pair current gain as the product of the two transistor betas.",
  id: "electronics/darlington-beta",
  inputs: [
    {
      id: "betaOneInt",
      kind: "integer",
      label: "First transistor beta",
      minimum: 1,
    },
    {
      id: "betaTwoInt",
      kind: "integer",
      label: "Second transistor beta",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "darlingtonBeta", kind: "integer", label: "Darlington beta" },
  ],
  title: "Darlington Beta",
});
export const runDarlingtonBeta = darlingtonBetaTool.execute;
export default darlingtonBetaTool;
