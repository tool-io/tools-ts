import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MeanCorpuscularHemoglobinConcentrationInput = {
  readonly hemoglobinGDl: number;
  readonly hematocritPercent: number;
};

export type MeanCorpuscularHemoglobinConcentrationOutput = {
  readonly mchcGDl: number;
};

export const meanCorpuscularHemoglobinConcentrationExample = {
  input: { hemoglobinGDl: 15, hematocritPercent: 45 },
  output: { mchcGDl: 33.333333333333336 },
} satisfies ToolExample<
  MeanCorpuscularHemoglobinConcentrationInput,
  MeanCorpuscularHemoglobinConcentrationOutput
>;

export const meanCorpuscularHemoglobinConcentrationTool = createSimpleTool({
  id: "biology/mean-corpuscular-hemoglobin-concentration",
  title: "MCHC Calculator",
  description:
    "Compute mean corpuscular hemoglobin concentration from hemoglobin and hematocrit.",
  inputs: [
    {
      id: "hemoglobinGDl",
      kind: "number",
      label: "Hemoglobin",
      unit: "g/dL",
    },
    {
      id: "hematocritPercent",
      kind: "number",
      label: "Hematocrit",
      minimum: Number.MIN_VALUE,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "mchcGDl",
      kind: "number",
      label: "Mean corpuscular hemoglobin concentration",
      unit: "g/dL",
    },
  ],
  calculate: (input) => ({
    mchcGDl:
      ((input.hemoglobinGDl as number) * 100) /
      (input.hematocritPercent as number),
  }),
});
export const runMeanCorpuscularHemoglobinConcentration =
  meanCorpuscularHemoglobinConcentrationTool.execute;
export default meanCorpuscularHemoglobinConcentrationTool;
