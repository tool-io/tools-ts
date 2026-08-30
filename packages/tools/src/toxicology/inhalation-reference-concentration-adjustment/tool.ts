import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly animalPointOfDepartureMgPerCubicMeter: number;
  readonly hoursPerExposureDay: number;
  readonly exposureDaysPerWeek: number;
  readonly dosimetricAdjustment: number;
  readonly assessmentFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly continuousEquivalentMgPerCubicMeter: number;
  readonly derivedReferenceConcentrationMgPerCubicMeter: number;
}>;
const inputFields = [
  {
    id: "animalPointOfDepartureMgPerCubicMeter",
    label: "Animal point of departure mg per cubic meter",
    kind: "number",
  },
  {
    id: "hoursPerExposureDay",
    label: "Hours per exposure day",
    kind: "number",
  },
  {
    id: "exposureDaysPerWeek",
    label: "Exposure days per week",
    kind: "number",
  },
  {
    id: "dosimetricAdjustment",
    label: "Dosimetric adjustment",
    kind: "number",
  },
  { id: "assessmentFactors", label: "Assessment factors", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.animalPointOfDepartureMgPerCubicMeter,
    "animalPointOfDepartureMgPerCubicMeter",
  );
  positive(input.hoursPerExposureDay, "hoursPerExposureDay");
  positive(input.exposureDaysPerWeek, "exposureDaysPerWeek");
  if (
    input.hoursPerExposureDay > 24 ||
    input.exposureDaysPerWeek > 7 ||
    !input.assessmentFactors.length
  )
    simpleError(
      "hoursPerExposureDay",
      "Exposure schedule must fit a day/week and factors must be nonempty.",
    );
  positive(input.dosimetricAdjustment, "dosimetricAdjustment");
  input.assessmentFactors.forEach((v) => {
    if (v < 1)
      simpleError("assessmentFactors", "Factors at least one required.");
  });
  const continuousEquivalentMgPerCubicMeter =
    (((input.animalPointOfDepartureMgPerCubicMeter *
      input.hoursPerExposureDay) /
      24) *
      input.exposureDaysPerWeek) /
    7;
  return {
    continuousEquivalentMgPerCubicMeter,
    derivedReferenceConcentrationMgPerCubicMeter:
      (continuousEquivalentMgPerCubicMeter * input.dosimetricAdjustment) /
      input.assessmentFactors.reduce((a, b) => a * b, 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  animalPointOfDepartureMgPerCubicMeter: 10,
  hoursPerExposureDay: 6,
  exposureDaysPerWeek: 5,
  dosimetricAdjustment: 0.5,
  assessmentFactors: [10, 3],
} satisfies Input;
export const exampleOutput = {
  continuousEquivalentMgPerCubicMeter: 1.7857142857142858,
  derivedReferenceConcentrationMgPerCubicMeter: 0.02976190476190476,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/inhalation-reference-concentration-adjustment",
  title: "Reference Concentration",
  description:
    "Apply caller continuous-exposure and dosimetric adjustments plus assessment factors to an inhalation POD; gas/particle-specific dosimetry and authoritative RfC derivation are not performed.",
  inputs: inputFields,
  outputs: [
    {
      id: "continuousEquivalentMgPerCubicMeter",
      label: "Continuous equivalent mg per cubic meter",
      kind: "number",
    },
    {
      id: "derivedReferenceConcentrationMgPerCubicMeter",
      label: "Derived reference concentration mg per cubic meter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      animalPointOfDepartureMgPerCubicMeter:
        value.animalPointOfDepartureMgPerCubicMeter as number,
      hoursPerExposureDay: value.hoursPerExposureDay as number,
      exposureDaysPerWeek: value.exposureDaysPerWeek as number,
      dosimetricAdjustment: value.dosimetricAdjustment as number,
      assessmentFactors: value.assessmentFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
