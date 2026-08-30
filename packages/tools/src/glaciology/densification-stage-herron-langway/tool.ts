import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly currentDensityKgPerM3: number;
  readonly iceDensityKgPerM3: number;
  readonly stageBoundaryDensityKgPerM3: number;
  readonly accumulationMwePerYear: number;
  readonly temperatureKelvin: number;
  readonly gasConstantJPerMolK: number;
  readonly stageOnePrefactor: number;
  readonly stageTwoPrefactor: number;
  readonly stageOneActivationJPerMol: number;
  readonly stageTwoActivationJPerMol: number;
}>;
export type Output = Readonly<{
  readonly densificationStage: number;
  readonly densityIncreaseKgPerM3Year: number;
}>;
const inputFields = [
  {
    id: "currentDensityKgPerM3",
    label: "Current density kg per m3",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "stageBoundaryDensityKgPerM3",
    label: "Stage boundary density kg per m3",
    kind: "number",
  },
  {
    id: "accumulationMwePerYear",
    label: "Accumulation mwe per year",
    kind: "number",
  },
  { id: "temperatureKelvin", label: "Temperature kelvin", kind: "number" },
  {
    id: "gasConstantJPerMolK",
    label: "Gas constant j per mol k",
    kind: "number",
  },
  { id: "stageOnePrefactor", label: "Stage one prefactor", kind: "number" },
  { id: "stageTwoPrefactor", label: "Stage two prefactor", kind: "number" },
  {
    id: "stageOneActivationJPerMol",
    label: "Stage one activation j per mol",
    kind: "number",
  },
  {
    id: "stageTwoActivationJPerMol",
    label: "Stage two activation j per mol",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.currentDensityKgPerM3, "currentDensityKgPerM3");
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.stageBoundaryDensityKgPerM3, "stageBoundaryDensityKgPerM3");
  positive(input.accumulationMwePerYear, "accumulationMwePerYear");
  positive(input.temperatureKelvin, "temperatureKelvin");
  positive(input.gasConstantJPerMolK, "gasConstantJPerMolK");
  positive(input.stageOnePrefactor, "stageOnePrefactor");
  positive(input.stageTwoPrefactor, "stageTwoPrefactor");
  nonnegative(input.stageOneActivationJPerMol, "stageOneActivationJPerMol");
  nonnegative(input.stageTwoActivationJPerMol, "stageTwoActivationJPerMol");
  if (
    input.currentDensityKgPerM3 >= input.iceDensityKgPerM3 ||
    input.stageBoundaryDensityKgPerM3 >= input.iceDensityKgPerM3
  )
    simpleError(
      "currentDensityKgPerM3",
      "Firn and stage boundary below ice density required.",
    );
  const densificationStage =
      input.currentDensityKgPerM3 < input.stageBoundaryDensityKgPerM3 ? 1 : 2,
    pre =
      densificationStage === 1
        ? input.stageOnePrefactor
        : input.stageTwoPrefactor,
    e =
      densificationStage === 1
        ? input.stageOneActivationJPerMol
        : input.stageTwoActivationJPerMol,
    k =
      pre *
      Math.exp(-e / (input.gasConstantJPerMolK * input.temperatureKelvin)) *
      input.accumulationMwePerYear ** (densificationStage === 1 ? 1 : 0.5);
  return {
    densificationStage,
    densityIncreaseKgPerM3Year:
      k * (input.iceDensityKgPerM3 - input.currentDensityKgPerM3),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  currentDensityKgPerM3: 300,
  iceDensityKgPerM3: 900,
  stageBoundaryDensityKgPerM3: 550,
  accumulationMwePerYear: 1,
  temperatureKelvin: 250,
  gasConstantJPerMolK: 8.314,
  stageOnePrefactor: 0.02,
  stageTwoPrefactor: 0.04,
  stageOneActivationJPerMol: 0,
  stageTwoActivationJPerMol: 0,
} satisfies Input;
export const exampleOutput = {
  densificationStage: 1,
  densityIncreaseKgPerM3Year: 12,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/densification-stage-herron-langway",
  title: "Densification Stage Herron Langway",
  description:
    "Evaluate instantaneous Herron–Langway-form stage kinetics k(T)·accumulation^p·(rho_ice−rho), using supplied stage boundary and unit-compatible prefactors; not an integrated age-depth model.",
  inputs: inputFields,
  outputs: [
    { id: "densificationStage", label: "Densification stage", kind: "number" },
    {
      id: "densityIncreaseKgPerM3Year",
      label: "Density increase kg per m3 year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      currentDensityKgPerM3: value.currentDensityKgPerM3 as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      stageBoundaryDensityKgPerM3: value.stageBoundaryDensityKgPerM3 as number,
      accumulationMwePerYear: value.accumulationMwePerYear as number,
      temperatureKelvin: value.temperatureKelvin as number,
      gasConstantJPerMolK: value.gasConstantJPerMolK as number,
      stageOnePrefactor: value.stageOnePrefactor as number,
      stageTwoPrefactor: value.stageTwoPrefactor as number,
      stageOneActivationJPerMol: value.stageOneActivationJPerMol as number,
      stageTwoActivationJPerMol: value.stageTwoActivationJPerMol as number,
    }),
});
export const run = tool.execute;
export default tool;
