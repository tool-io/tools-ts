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
  readonly sampleDryBiomassesMg: readonly number[];
  readonly sampledBenthicAreasM2: readonly number[];
  readonly blankBiomassesMg: readonly number[];
}>;
export type Output = Readonly<{
  readonly blankCorrectedSampleBiomassMg: readonly number[];
  readonly pooledDryBiomassMgM2: number;
}>;
const inputFields = [
  {
    id: "sampleDryBiomassesMg",
    label: "Sample dry biomasses mg",
    kind: "numberList",
  },
  {
    id: "sampledBenthicAreasM2",
    label: "Sampled benthic areas m2",
    kind: "numberList",
  },
  { id: "blankBiomassesMg", label: "Blank biomasses mg", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampledBenthicAreasM2.forEach((v) =>
    positive(v, "sampledBenthicAreasM2"),
  );
  input.sampleDryBiomassesMg.forEach((v) =>
    nonnegative(v, "sampleDryBiomassesMg"),
  );
  input.blankBiomassesMg.forEach((v) => nonnegative(v, "blankBiomassesMg"));
  aligned(
    input.sampleDryBiomassesMg,
    input.sampledBenthicAreasM2,
    "sampleDryBiomassesMg",
  );
  aligned(
    input.sampleDryBiomassesMg,
    input.blankBiomassesMg,
    "sampleDryBiomassesMg",
  );
  const corrected = input.sampleDryBiomassesMg.map(
    (v, i) => v - input.blankBiomassesMg[i],
  );
  return {
    blankCorrectedSampleBiomassMg: corrected,
    pooledDryBiomassMgM2: sum(corrected) / sum(input.sampledBenthicAreasM2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleDryBiomassesMg: [10, 20],
  sampledBenthicAreasM2: [1, 2],
  blankBiomassesMg: [2, 4],
} satisfies Input;
export const exampleOutput = {
  blankCorrectedSampleBiomassMg: [8, 16],
  pooledDryBiomassMgM2: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/benthic-macroinvertebrate-biomass-area",
  title: "Benthic Macroinvertebrate Biomass Area Calculator",
  description:
    "Pool actual blank-corrected benthic dry mass by summed sampled area, not mean of unequal-area densities; negative corrections retained, no habitat-wide extrapolation or taxonomic index.",
  inputs: inputFields,
  outputs: [
    {
      id: "blankCorrectedSampleBiomassMg",
      label: "Blank corrected sample biomass mg",
      kind: "numberList",
    },
    {
      id: "pooledDryBiomassMgM2",
      label: "Pooled dry biomass mg m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleDryBiomassesMg: value.sampleDryBiomassesMg as readonly number[],
      sampledBenthicAreasM2: value.sampledBenthicAreasM2 as readonly number[],
      blankBiomassesMg: value.blankBiomassesMg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
