import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const labDilutionSeriesExample = {
  input: { previousConc: 100 },
  output: { dilutedConcentration: 50 },
} satisfies ToolExample<
  { readonly previousConc: number; readonly transferRatio?: number },
  { readonly dilutedConcentration: number }
>;

export const labDilutionSeriesTool = createSimpleTool({
  id: "biology/lab-dilution-series",
  title: "Lab Dilution Series Step",
  description:
    "Compute one serial dilution step: dilutedConcentration = previousConcentration x transferRatio, where the transfer ratio lies strictly between 0 and 1 and defaults to 0.5 for a two-fold dilution.",
  inputs: [
    {
      description:
        "Concentration entering the step; must be greater than zero.",
      id: "previousConc",
      label: "Previous concentration",
      kind: "number",
    },
    {
      default: 0.5,
      description:
        "Fraction transferred into the next tube, strictly between 0 and 1; defaults to 0.5.",
      id: "transferRatio",
      label: "Transfer ratio",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Concentration after the single dilution step.",
      id: "dilutedConcentration",
      label: "Diluted concentration",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const previousConc = input.previousConc as number;
    const transferRatio = input.transferRatio as number;
    if (!(previousConc > 0))
      simpleError(
        "previousConc",
        "The previous concentration must be greater than zero.",
      );
    if (!(transferRatio > 0 && transferRatio < 1))
      simpleError(
        "transferRatio",
        "The transfer ratio must lie strictly between 0 and 1.",
      );
    return { dilutedConcentration: previousConc * transferRatio };
  },
});
export const runLabDilutionSeries = labDilutionSeriesTool.execute;
export default labDilutionSeriesTool;
