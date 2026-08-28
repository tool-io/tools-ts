import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const hillCoefficientTool = createSimpleTool({
  id: "chemistry/hill-coefficient",
  title: "Hill Coefficient Calculator",
  description:
    "Compute the Hill coefficient as the slope between two points on a Hill plot of log10(Y/(1-Y)) versus log10 ligand concentration.",
  inputs: [
    {
      id: "log10SaturationRatio1",
      label: "Point 1 log10(Y/(1-Y))",
      kind: "number",
    },
    { id: "log10LigandConc1", label: "Point 1 log10[L]", kind: "number" },
    {
      id: "log10SaturationRatio2",
      label: "Point 2 log10(Y/(1-Y))",
      kind: "number",
    },
    { id: "log10LigandConc2", label: "Point 2 log10[L]", kind: "number" },
  ],
  outputs: [{ id: "hillN", label: "Hill coefficient n", kind: "number" }],
  calculate: (input) => {
    const deltaX =
      (input.log10LigandConc2 as number) - (input.log10LigandConc1 as number);
    if (deltaX === 0)
      simpleError(
        "log10LigandConc2",
        "The two ligand concentrations must differ.",
        "degenerate_points",
      );
    return {
      hillN:
        ((input.log10SaturationRatio2 as number) -
          (input.log10SaturationRatio1 as number)) /
        deltaX,
    };
  },
});
export default hillCoefficientTool;
export const runHillCoefficient = hillCoefficientTool.execute;

export type HillCoefficientInput = {
  readonly log10SaturationRatio1: number;
  readonly log10LigandConc1: number;
  readonly log10SaturationRatio2: number;
  readonly log10LigandConc2: number;
};

export type HillCoefficientOutput = {
  readonly hillN: number;
};

export const hillCoefficientExample = {
  input: {
    log10SaturationRatio1: -1,
    log10LigandConc1: -2,
    log10SaturationRatio2: 1,
    log10LigandConc2: -1,
  },
  output: {
    hillN: 2,
  },
} satisfies ToolExample<HillCoefficientInput, HillCoefficientOutput>;
