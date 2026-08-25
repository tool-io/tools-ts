import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ec50HillExample = {
  input: { conc: 30, ec50: 10, hillSlope: 2 },
  output: { predictedEffectFraction: 0.9 },
} satisfies ToolExample<
  { readonly conc: number; readonly ec50: number; readonly hillSlope: number },
  { readonly predictedEffectFraction: number }
>;

export const ec50HillTool = createSimpleTool({
  id: "biology/ec50-hill",
  title: "Hill EC50 Fit Check",
  description:
    "Check a Hill-Langmuir fit by predicting the effect fraction at a concentration from the fitted EC50 and hill slope.",
  inputs: [
    {
      description: "Ligand concentration; must not be negative.",
      id: "conc",
      label: "Concentration",
      kind: "number",
      unit: "nM",
    },
    {
      description:
        "Half-maximal effective concentration from the fit; must be greater than zero.",
      id: "ec50",
      label: "EC50",
      kind: "number",
      unit: "nM",
    },
    {
      description: "Hill slope of the curve; must be greater than zero.",
      id: "hillSlope",
      label: "Hill slope",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Predicted response as a fraction between zero and one.",
      id: "predictedEffectFraction",
      label: "Predicted effect fraction",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const conc = input.conc as number;
    const ec50 = input.ec50 as number;
    const hillSlope = input.hillSlope as number;
    if (!(conc >= 0))
      simpleError(
        "conc",
        "The concentration must not be negative.",
        "invalid_conc",
      );
    if (!(ec50 > 0))
      simpleError(
        "ec50",
        "The EC50 must be greater than zero.",
        "invalid_ec50",
      );
    if (!(hillSlope > 0))
      simpleError(
        "hillSlope",
        "The hill slope must be greater than zero.",
        "invalid_slope",
      );
    const ratio = Math.pow(conc / ec50, hillSlope);
    return { predictedEffectFraction: ratio / (1 + ratio) };
  },
});
export const runEc50Hill = ec50HillTool.execute;
export default ec50HillTool;
