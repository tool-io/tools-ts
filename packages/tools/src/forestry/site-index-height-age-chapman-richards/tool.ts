import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly observedDominantHeightM: number;
  readonly observedStandAgeYears: number;
  readonly referenceSiteAgeYears: number;
  readonly chapmanGrowthRatePerYear: number;
  readonly chapmanShapeExponent: number;
}>;
export type Output = Readonly<{
  readonly calibratedAsymptoticHeightM: number;
  readonly referenceAgeSiteIndexM: number;
}>;
const inputFields = [
  {
    id: "observedDominantHeightM",
    label: "Observed dominant height m",
    kind: "number",
  },
  {
    id: "observedStandAgeYears",
    label: "Observed stand age years",
    kind: "number",
  },
  {
    id: "referenceSiteAgeYears",
    label: "Reference site age years",
    kind: "number",
  },
  {
    id: "chapmanGrowthRatePerYear",
    label: "Chapman growth rate per year",
    kind: "number",
  },
  {
    id: "chapmanShapeExponent",
    label: "Chapman shape exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedDominantHeightM, "observedDominantHeightM");
  positive(input.observedStandAgeYears, "observedStandAgeYears");
  positive(input.referenceSiteAgeYears, "referenceSiteAgeYears");
  positive(input.chapmanGrowthRatePerYear, "chapmanGrowthRatePerYear");
  positive(input.chapmanShapeExponent, "chapmanShapeExponent");
  const growth = (t: number) =>
      -Math.expm1(-input.chapmanGrowthRatePerYear * t),
    calibratedAsymptoticHeightM =
      input.observedDominantHeightM /
      growth(input.observedStandAgeYears) ** input.chapmanShapeExponent;
  return {
    calibratedAsymptoticHeightM,
    referenceAgeSiteIndexM:
      calibratedAsymptoticHeightM *
      growth(input.referenceSiteAgeYears) ** input.chapmanShapeExponent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDominantHeightM: 10,
  observedStandAgeYears: 10,
  referenceSiteAgeYears: 20,
  chapmanGrowthRatePerYear: 0.06931471805599453,
  chapmanShapeExponent: 1,
} satisfies Input;
export const exampleOutput = {
  calibratedAsymptoticHeightM: 20,
  referenceAgeSiteIndexM: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/site-index-height-age-chapman-richards",
  title: "Chapman-Richards Site Index Height Age",
  description:
    "Normalize supplied dominant height/age to a reference-age Chapman–Richards site index with explicit growth/shape calibration; no generic height/age ratio or universal regional site table.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedAsymptoticHeightM",
      label: "Calibrated asymptotic height m",
      kind: "number",
    },
    {
      id: "referenceAgeSiteIndexM",
      label: "Reference age site index m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDominantHeightM: value.observedDominantHeightM as number,
      observedStandAgeYears: value.observedStandAgeYears as number,
      referenceSiteAgeYears: value.referenceSiteAgeYears as number,
      chapmanGrowthRatePerYear: value.chapmanGrowthRatePerYear as number,
      chapmanShapeExponent: value.chapmanShapeExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
