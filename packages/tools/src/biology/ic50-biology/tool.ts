import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ic50BiologyExample = {
  input: { concentration: 5, inhibitionFraction: 0.75, slope: 1 },
} satisfies ToolExample<{
  readonly concentration: number;
  readonly inhibitionFraction: number;
  readonly slope?: number;
}>;

export const ic50BiologyTool = createSimpleTool({
  id: "biology/ic50-biology",
  title: "IC50 Inhibition Conc",
  description:
    "Estimate the half-maximal inhibitory concentration by inverting the Hill equation.",
  inputs: [
    { id: "concentration", label: "Concentration", kind: "number" },
    {
      id: "inhibitionFraction",
      label: "Inhibition fraction",
      kind: "number",
    },
    { default: 1, id: "slope", label: "Slope factor", kind: "number" },
  ],
  outputs: [
    {
      id: "ic50Concentration",
      label: "IC50 concentration",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const concentration = input.concentration as number;
    const inhibitionFraction = input.inhibitionFraction as number;
    const slope = input.slope as number;
    if (concentration <= 0)
      simpleError(
        "concentration",
        "Concentration must be greater than zero.",
        "invalid_concentration",
      );
    if (inhibitionFraction <= 0 || inhibitionFraction >= 1)
      simpleError(
        "inhibitionFraction",
        "Inhibition fraction must be strictly between zero and one.",
        "invalid_inhibition",
      );
    if (slope <= 0)
      simpleError("slope", "Slope must be greater than zero.", "invalid_slope");
    return {
      ic50Concentration:
        concentration *
        Math.pow((1 - inhibitionFraction) / inhibitionFraction, 1 / slope),
    };
  },
});
export const runIc50Biology = ic50BiologyTool.execute;
export default ic50BiologyTool;
