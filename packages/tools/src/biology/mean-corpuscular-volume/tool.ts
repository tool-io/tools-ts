import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MeanCorpuscularVolumeInput = {
  readonly hematocritPercent: number;
  readonly rbcMillionPerUl: number;
};

export type MeanCorpuscularVolumeOutput = {
  readonly mcvFemtoliters: number;
};

export const meanCorpuscularVolumeExample = {
  input: { hematocritPercent: 45, rbcMillionPerUl: 5 },
  output: { mcvFemtoliters: 90 },
} satisfies ToolExample<
  MeanCorpuscularVolumeInput,
  MeanCorpuscularVolumeOutput
>;

export const meanCorpuscularVolumeTool = createSimpleTool({
  id: "biology/mean-corpuscular-volume",
  title: "MCV Calculator",
  description:
    "Compute mean corpuscular volume from hematocrit and red blood cell count.",
  inputs: [
    {
      id: "hematocritPercent",
      kind: "number",
      label: "Hematocrit",
      minimum: Number.MIN_VALUE,
      unit: "%",
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
      id: "mcvFemtoliters",
      kind: "number",
      label: "Mean corpuscular volume",
      unit: "fL",
    },
  ],
  calculate: (input) => ({
    mcvFemtoliters:
      ((input.hematocritPercent as number) * 10) /
      (input.rbcMillionPerUl as number),
  }),
});
export const runMeanCorpuscularVolume = meanCorpuscularVolumeTool.execute;
export default meanCorpuscularVolumeTool;
