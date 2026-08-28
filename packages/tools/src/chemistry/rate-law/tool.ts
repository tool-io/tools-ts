import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rateLawExample = {
  input: {
    orderA: 1,
    orderB: 2,
    rateConstantK: 0.05,
    reactantAM: 0.5,
    reactantBM: 0.25,
  },
} satisfies ToolExample<{
  readonly orderA: number;
  readonly orderB: number;
  readonly rateConstantK: number;
  readonly reactantAM: number;
  readonly reactantBM: number;
}>;

export const rateLawTool = createSimpleTool({
  id: "chemistry/rate-law",
  title: "Rate Law Calculator",
  description:
    "Compute the reaction rate from the rate constant and reactant concentrations raised to their reaction orders.",
  inputs: [
    {
      id: "rateConstantK",
      label: "Rate constant k",
      kind: "number",
      unit: "M/s",
    },
    {
      id: "reactantAM",
      label: "Reactant A concentration",
      kind: "number",
      unit: "M",
    },
    {
      id: "reactantBM",
      label: "Reactant B concentration",
      kind: "number",
      unit: "M",
    },
    {
      id: "orderA",
      label: "Reaction order A",
      kind: "number",
      minimum: 0,
      maximum: 3,
    },
    {
      id: "orderB",
      label: "Reaction order B",
      kind: "number",
      minimum: 0,
      maximum: 3,
    },
  ],
  outputs: [
    {
      id: "reactionRateMPerS",
      label: "Reaction rate",
      kind: "number",
      unit: "M/s",
    },
  ],
  calculate: (input) => {
    const rateConstantK = input.rateConstantK as number;
    const reactantAM = input.reactantAM as number;
    const reactantBM = input.reactantBM as number;
    if (!(rateConstantK > 0))
      simpleError("rateConstantK", "Rate constant must be positive.");
    if (!(reactantAM > 0))
      simpleError("reactantAM", "Reactant A concentration must be positive.");
    if (!(reactantBM > 0))
      simpleError("reactantBM", "Reactant B concentration must be positive.");
    return {
      reactionRateMPerS:
        rateConstantK *
        Math.pow(reactantAM, input.orderA as number) *
        Math.pow(reactantBM, input.orderB as number),
    };
  },
});
export const runRateLaw = rateLawTool.execute;
export default rateLawTool;
