import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly sampleCt: number;
  readonly calibrationIntercept: number;
  readonly calibrationSlope: number;
  readonly extractionVolumeUl: number;
  readonly templateVolumeUl: number;
  readonly specimenVolumeMl: number;
}>;
export type Output = Readonly<{
  readonly copiesPerReaction: number;
  readonly copiesPerMlSpecimen: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.extractionVolumeUl, "extractionVolumeUl");
  positive(input.templateVolumeUl, "templateVolumeUl");
  positive(input.specimenVolumeMl, "specimenVolumeMl");
  if (
    input.calibrationSlope >= 0 ||
    input.templateVolumeUl > input.extractionVolumeUl
  )
    simpleError(
      "calibrationSlope",
      "Negative Ct/log10 slope and template volume within extract required.",
    );
  const copiesPerReaction =
    10 **
    ((input.sampleCt - input.calibrationIntercept) / input.calibrationSlope);
  return {
    copiesPerReaction,
    copiesPerMlSpecimen:
      (copiesPerReaction * input.extractionVolumeUl) /
      input.templateVolumeUl /
      input.specimenVolumeMl,
  };
};
export const exampleInput = {
  sampleCt: 20,
  calibrationIntercept: 30,
  calibrationSlope: -3.3333333333333335,
  extractionVolumeUl: 100,
  templateVolumeUl: 5,
  specimenVolumeMl: 1,
} satisfies Input;
export const exampleOutput = {
  copiesPerReaction: 1000,
  copiesPerMlSpecimen: 20000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/parasite-ct-copy-number",
  title: "Parasite Ct Copy Number",
  description:
    "Back-calculate parasite copy concentration from a supplied Ct calibration and extraction volumes.",
  inputs: [
    { id: "sampleCt", label: "Sample ct", kind: "number" },
    {
      id: "calibrationIntercept",
      label: "Calibration intercept",
      kind: "number",
    },
    { id: "calibrationSlope", label: "Calibration slope", kind: "number" },
    { id: "extractionVolumeUl", label: "Extraction volume ul", kind: "number" },
    { id: "templateVolumeUl", label: "Template volume ul", kind: "number" },
    { id: "specimenVolumeMl", label: "Specimen volume ml", kind: "number" },
  ],
  outputs: [
    { id: "copiesPerReaction", label: "Copies per reaction", kind: "number" },
    {
      id: "copiesPerMlSpecimen",
      label: "Copies per ml specimen",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleCt: value.sampleCt as number,
      calibrationIntercept: value.calibrationIntercept as number,
      calibrationSlope: value.calibrationSlope as number,
      extractionVolumeUl: value.extractionVolumeUl as number,
      templateVolumeUl: value.templateVolumeUl as number,
      specimenVolumeMl: value.specimenVolumeMl as number,
    }),
});
export const run = tool.execute;
export default tool;
