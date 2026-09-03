import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedIndependentConcreteLotVolumesM3: readonly number[];
  readonly callerVerifiedMaximumVolumePerSampleSetM3: number;
  readonly callerRequiredCylindersPerSet: number;
  readonly callerIndependentReserveCylindersPerLot: number;
}>;
export type Output = Readonly<{
  readonly requiredSampleSetsPerLot: readonly number[];
  readonly scheduledCylinderCount: number;
}>;
const inputFields = [
  {
    id: "observedIndependentConcreteLotVolumesM3",
    label: "Observed independent concrete lot volumes m3",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMaximumVolumePerSampleSetM3",
    label: "Caller verified maximum volume per sample set m3",
    kind: "number",
  },
  {
    id: "callerRequiredCylindersPerSet",
    label: "Caller required cylinders per set",
    kind: "number",
  },
  {
    id: "callerIndependentReserveCylindersPerLot",
    label: "Caller independent reserve cylinders per lot",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIndependentConcreteLotVolumesM3.forEach((v) =>
    positive(v, "observedIndependentConcreteLotVolumesM3"),
  );
  positive(
    input.callerVerifiedMaximumVolumePerSampleSetM3,
    "callerVerifiedMaximumVolumePerSampleSetM3",
  );
  positive(
    input.callerRequiredCylindersPerSet,
    "callerRequiredCylindersPerSet",
  );
  nonnegative(
    input.callerIndependentReserveCylindersPerLot,
    "callerIndependentReserveCylindersPerLot",
  );
  bounded(input.callerRequiredCylindersPerSet, "cylinders", 1, 100);
  bounded(input.callerIndependentReserveCylindersPerLot, "reserve", 0, 100);
  const sets = input.observedIndependentConcreteLotVolumesM3.map((v) =>
    Math.ceil(v / input.callerVerifiedMaximumVolumePerSampleSetM3),
  );
  sets.forEach((v) => bounded(v, "sets", 1, 1000000));
  return {
    requiredSampleSetsPerLot: sets,
    scheduledCylinderCount:
      sum(sets) * input.callerRequiredCylindersPerSet +
      input.observedIndependentConcreteLotVolumesM3.length *
        input.callerIndependentReserveCylindersPerLot,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIndependentConcreteLotVolumesM3: [10, 21],
  callerVerifiedMaximumVolumePerSampleSetM3: 10,
  callerRequiredCylindersPerSet: 3,
  callerIndependentReserveCylindersPerLot: 1,
} satisfies Input;
export const exampleOutput = {
  requiredSampleSetsPerLot: [1, 3],
  scheduledCylinderCount: 14,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/concrete-test-cylinder-count",
  title: "Concrete Test Cylinder Count Calculator",
  description:
    "Per-independent-lot discrete cylinder-set schedule with explicit verified volume policy and reserve counts, no concrete strength acceptance or default testing standard. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredSampleSetsPerLot",
      label: "Required sample sets per lot",
      kind: "numberList",
    },
    {
      id: "scheduledCylinderCount",
      label: "Scheduled cylinder count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIndependentConcreteLotVolumesM3:
        value.observedIndependentConcreteLotVolumesM3 as readonly number[],
      callerVerifiedMaximumVolumePerSampleSetM3:
        value.callerVerifiedMaximumVolumePerSampleSetM3 as number,
      callerRequiredCylindersPerSet:
        value.callerRequiredCylindersPerSet as number,
      callerIndependentReserveCylindersPerLot:
        value.callerIndependentReserveCylindersPerLot as number,
    }),
});
export const run = tool.execute;
export default tool;
