import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly spontaneousTrackCount: number;
  readonly inducedTrackCount: number;
  readonly referenceTrackDensity: number;
  readonly calibrationZetaYearsAreaPerTrack: number;
  readonly geometryFactor: number;
  readonly decayConstantPerYear: number;
}>;
export type Output = Readonly<{
  readonly fissionTrackAgeScenarioYears: number;
  readonly countingAgeSigmaYears: number;
}>;
const inputFields = [
  {
    id: "spontaneousTrackCount",
    label: "Spontaneous track count",
    kind: "integer",
  },
  { id: "inducedTrackCount", label: "Induced track count", kind: "integer" },
  {
    id: "referenceTrackDensity",
    label: "Reference track density",
    kind: "number",
  },
  {
    id: "calibrationZetaYearsAreaPerTrack",
    label: "Calibration zeta years area per track",
    kind: "number",
  },
  { id: "geometryFactor", label: "Geometry factor", kind: "number" },
  {
    id: "decayConstantPerYear",
    label: "Decay constant per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.inducedTrackCount, "inducedTrackCount");
  positive(input.referenceTrackDensity, "referenceTrackDensity");
  positive(
    input.calibrationZetaYearsAreaPerTrack,
    "calibrationZetaYearsAreaPerTrack",
  );
  positive(input.geometryFactor, "geometryFactor");
  positive(input.decayConstantPerYear, "decayConstantPerYear");
  positive(input.spontaneousTrackCount, "spontaneousTrackCount");
  count(input.spontaneousTrackCount, "spontaneousTrackCount");
  count(input.inducedTrackCount, "inducedTrackCount");
  const a =
    (input.decayConstantPerYear *
      input.calibrationZetaYearsAreaPerTrack *
      input.geometryFactor *
      input.referenceTrackDensity *
      input.spontaneousTrackCount) /
    input.inducedTrackCount;
  return {
    fissionTrackAgeScenarioYears: Math.log1p(a) / input.decayConstantPerYear,
    countingAgeSigmaYears:
      (a / (1 + a) / input.decayConstantPerYear) *
      Math.sqrt(1 / input.spontaneousTrackCount + 1 / input.inducedTrackCount),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spontaneousTrackCount: 20,
  inducedTrackCount: 10,
  referenceTrackDensity: 100,
  calibrationZetaYearsAreaPerTrack: 10,
  geometryFactor: 0.5,
  decayConstantPerYear: 0.001,
} satisfies Input;
export const exampleOutput = {
  fissionTrackAgeScenarioYears: 693.1471805599452,
  countingAgeSigmaYears: 193.64916731037084,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/fission-track-age",
  title: "Fission Track Age",
  description:
    "Calculate supplied zeta-calibrated fission-track age and independent Poisson specimen-count uncertainty; geometry and reference density are explicit, and annealing/zeta/dosimeter uncertainties are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fissionTrackAgeScenarioYears",
      label: "Fission track age scenario years",
      kind: "number",
    },
    {
      id: "countingAgeSigmaYears",
      label: "Counting age sigma years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      spontaneousTrackCount: value.spontaneousTrackCount as number,
      inducedTrackCount: value.inducedTrackCount as number,
      referenceTrackDensity: value.referenceTrackDensity as number,
      calibrationZetaYearsAreaPerTrack:
        value.calibrationZetaYearsAreaPerTrack as number,
      geometryFactor: value.geometryFactor as number,
      decayConstantPerYear: value.decayConstantPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
