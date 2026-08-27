import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const quantalContentExample = {
  input: { meanEndplatePotentialMv: 5, miniaturePotentialMv: 0.5 },
  output: { quantalContent: 10 },
} satisfies ToolExample<
  {
    readonly meanEndplatePotentialMv: number;
    readonly miniaturePotentialMv: number;
  },
  { readonly quantalContent: number }
>;

export const quantalContentTool = createSimpleTool({
  id: "biology/quantal-content",
  title: "Quantal Content m",
  description:
    "Estimate the neuromuscular quantal content m as the mean endplate potential amplitude divided by the average miniature endplate potential amplitude.",
  inputs: [
    {
      description:
        "Mean evoked endplate potential amplitude in millivolts; must be greater than zero.",
      id: "meanEndplatePotentialMv",
      label: "Mean endplate potential",
      kind: "number",
      unit: "mV",
    },
    {
      description:
        "Average spontaneous miniature endplate potential amplitude in millivolts; must be greater than zero.",
      id: "miniaturePotentialMv",
      label: "Miniature potential",
      kind: "number",
      unit: "mV",
    },
  ],
  outputs: [
    {
      description:
        "Estimated number of quanta released per stimulus (quantal content m).",
      id: "quantalContent",
      label: "Quantal content",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const meanEndplatePotentialMv = input.meanEndplatePotentialMv as number;
    const miniaturePotentialMv = input.miniaturePotentialMv as number;
    if (!(meanEndplatePotentialMv > 0))
      simpleError(
        "meanEndplatePotentialMv",
        "The mean endplate potential must be greater than zero.",
        "invalid_mean",
      );
    if (!(miniaturePotentialMv > 0))
      simpleError(
        "miniaturePotentialMv",
        "The miniature potential must be greater than zero.",
        "invalid_miniature",
      );
    return { quantalContent: meanEndplatePotentialMv / miniaturePotentialMv };
  },
});
export const runQuantalContent = quantalContentTool.execute;
export default quantalContentTool;
