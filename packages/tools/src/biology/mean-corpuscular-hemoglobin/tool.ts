import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MeanCorpuscularHemoglobinInput = {
  readonly hemoglobinGDl: number;
  readonly rbcMillionPerUl: number;
};

export type MeanCorpuscularHemoglobinOutput = {
  readonly mchPicograms: number;
};

export const meanCorpuscularHemoglobinExample = {
  input: { hemoglobinGDl: 15, rbcMillionPerUl: 5 },
  output: { mchPicograms: 30 },
} satisfies ToolExample<
  MeanCorpuscularHemoglobinInput,
  MeanCorpuscularHemoglobinOutput
>;

export const meanCorpuscularHemoglobinTool = createSimpleTool({
  id: "biology/mean-corpuscular-hemoglobin",
  title: "MCH Calculator",
  description:
    "Compute mean corpuscular hemoglobin from hemoglobin and red blood cell count.",
  inputs: [
    {
      id: "hemoglobinGDl",
      kind: "number",
      label: "Hemoglobin",
      unit: "g/dL",
    },
    {
      id: "rbcMillionPerUl",
      kind: "number",
      label: "Red blood cell count",
      minimum: Number.MIN_VALUE,
      unit: "million/µL",
    },
  ],
  outputs: [
    {
      id: "mchPicograms",
      kind: "number",
      label: "Mean corpuscular hemoglobin",
      unit: "pg",
    },
  ],
  calculate: (input) => ({
    mchPicograms:
      ((input.hemoglobinGDl as number) * 10) /
      (input.rbcMillionPerUl as number),
  }),
});
export const runMeanCorpuscularHemoglobin =
  meanCorpuscularHemoglobinTool.execute;
export default meanCorpuscularHemoglobinTool;
