import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly cliffFaceAreasM2: readonly number[];
  readonly normalBackwastingMYear: readonly number[];
  readonly iceDensityKgM3: number;
}>;
export type Output = Readonly<{
  readonly faceVolumeLossesM3Year: readonly number[];
  readonly totalCliffMassLossKgYear: number;
}>;
const inputFields = [
  { id: "cliffFaceAreasM2", label: "Cliff face areas m2", kind: "numberList" },
  {
    id: "normalBackwastingMYear",
    label: "Normal backwasting m year",
    kind: "numberList",
  },
  { id: "iceDensityKgM3", label: "Ice density kg m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgM3, "iceDensityKgM3");
  input.cliffFaceAreasM2.forEach((v) => nonnegative(v, "cliffFaceAreasM2"));
  aligned(
    input.cliffFaceAreasM2,
    input.normalBackwastingMYear,
    "cliffFaceAreasM2",
  );
  const volumes = input.cliffFaceAreasM2.map(
    (v, i) => v * input.normalBackwastingMYear[i],
  );
  return {
    faceVolumeLossesM3Year: volumes,
    totalCliffMassLossKgYear: sum(volumes) * input.iceDensityKgM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cliffFaceAreasM2: [10, 20],
  normalBackwastingMYear: [1, 2],
  iceDensityKgM3: 900,
} satisfies Input;
export const exampleOutput = {
  faceVolumeLossesM3Year: [10, 40],
  totalCliffMassLossKgYear: 45000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/ice-cliff-mass-loss-per-year",
  title: "Ice Cliff Mass Loss Per Year Calculator",
  description:
    "Integrate observed face area times normal backwasting to annual signed cliff volume/mass loss; no projected-area confusion, fracture prediction or invented enhancement.",
  inputs: inputFields,
  outputs: [
    {
      id: "faceVolumeLossesM3Year",
      label: "Face volume losses m3 year",
      kind: "numberList",
    },
    {
      id: "totalCliffMassLossKgYear",
      label: "Total cliff mass loss kg year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cliffFaceAreasM2: value.cliffFaceAreasM2 as readonly number[],
      normalBackwastingMYear: value.normalBackwastingMYear as readonly number[],
      iceDensityKgM3: value.iceDensityKgM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
