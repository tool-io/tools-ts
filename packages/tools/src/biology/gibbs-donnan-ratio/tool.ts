import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GibbsDonnanRatioInput = {
  readonly insideConcM: number;
  readonly outsideConcM: number;
};

export type GibbsDonnanRatioOutput = {
  readonly gibbsDonnanRatio: number;
};

export const gibbsDonnanRatioExample = {
  input: { insideConcM: 0.1, outsideConcM: 0.05 },
  output: { gibbsDonnanRatio: 2 },
} satisfies ToolExample<GibbsDonnanRatioInput, GibbsDonnanRatioOutput>;

export const gibbsDonnanRatioTool = createSimpleTool({
  id: "biology/gibbs-donnan-ratio",
  title: "Gibbs-Donnan Ratio",
  description:
    "Compute the Gibbs-Donnan ratio as the concentration of permeant ion inside a cell divided by its concentration outside.",
  inputs: [
    {
      id: "insideConcM",
      kind: "number",
      label: "Inside concentration",
      unit: "M",
    },
    {
      id: "outsideConcM",
      kind: "number",
      label: "Outside concentration",
      unit: "M",
    },
  ],
  outputs: [
    {
      id: "gibbsDonnanRatio",
      kind: "number",
      label: "Gibbs-Donnan ratio",
    },
  ],
  calculate: (input) => {
    const insideConcM = input.insideConcM as number;
    const outsideConcM = input.outsideConcM as number;
    if (!(insideConcM > 0))
      simpleError(
        "insideConcM",
        "The inside concentration must be greater than zero.",
      );
    if (!(outsideConcM > 0))
      simpleError(
        "outsideConcM",
        "The outside concentration must be greater than zero.",
      );
    return { gibbsDonnanRatio: insideConcM / outsideConcM };
  },
});
export const runGibbsDonnanRatio = gibbsDonnanRatioTool.execute;
export default gibbsDonnanRatioTool;
