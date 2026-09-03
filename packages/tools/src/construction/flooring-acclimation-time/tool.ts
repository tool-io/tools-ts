import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  strictlyIncreasing,
  ordered,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAcclimationElapsedHours: readonly number[];
  readonly observedFlooringMoistureFractions: readonly number[];
  readonly callerVerifiedMoistureLower: number;
  readonly callerVerifiedMoistureUpper: number;
  readonly callerRequiredWitnessedHoldHours: number;
}>;
export type Output = Readonly<{
  readonly witnessedQualificationStartHours: readonly number[];
  readonly witnessedQualifiedHoldHours: readonly number[];
  readonly noWitnessedQualifyingHold: boolean;
}>;
const inputFields = [
  {
    id: "observedAcclimationElapsedHours",
    label: "Observed acclimation elapsed hours",
    kind: "numberList",
  },
  {
    id: "observedFlooringMoistureFractions",
    label: "Observed flooring moisture fractions",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMoistureLower",
    label: "Caller verified moisture lower",
    kind: "number",
  },
  {
    id: "callerVerifiedMoistureUpper",
    label: "Caller verified moisture upper",
    kind: "number",
  },
  {
    id: "callerRequiredWitnessedHoldHours",
    label: "Caller required witnessed hold hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAcclimationElapsedHours.forEach((v) =>
    nonnegative(v, "observedAcclimationElapsedHours"),
  );
  nonnegative(
    input.callerRequiredWitnessedHoldHours,
    "callerRequiredWitnessedHoldHours",
  );
  input.observedFlooringMoistureFractions.forEach((v) =>
    fraction(v, "observedFlooringMoistureFractions"),
  );
  fraction(input.callerVerifiedMoistureLower, "callerVerifiedMoistureLower");
  fraction(input.callerVerifiedMoistureUpper, "callerVerifiedMoistureUpper");
  ordered(input.callerVerifiedMoistureLower, input.callerVerifiedMoistureUpper);
  aligned(
    input.observedAcclimationElapsedHours,
    input.observedFlooringMoistureFractions,
    "record",
  );
  strictlyIncreasing(input.observedAcclimationElapsedHours, "time");
  const starts: number[] = [],
    durations: number[] = [];
  let start: number | undefined;
  const append = (end: number) => {
    if (
      start !== undefined &&
      end - start >= input.callerRequiredWitnessedHoldHours
    ) {
      starts.push(start);
      durations.push(end - start);
    }
    start = undefined;
  };
  for (let i = 0; i < input.observedAcclimationElapsedHours.length; i++) {
    const v = input.observedFlooringMoistureFractions[i];
    if (
      v >= input.callerVerifiedMoistureLower &&
      v <= input.callerVerifiedMoistureUpper
    ) {
      if (start === undefined) start = input.observedAcclimationElapsedHours[i];
    } else if (start !== undefined)
      append(input.observedAcclimationElapsedHours[i - 1]);
  }
  append(input.observedAcclimationElapsedHours.at(-1)!);
  return {
    witnessedQualificationStartHours: starts,
    witnessedQualifiedHoldHours: durations,
    noWitnessedQualifyingHold: starts.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAcclimationElapsedHours: [0, 1, 3, 5],
  observedFlooringMoistureFractions: [0.1, 0.2, 0.21, 0.2],
  callerVerifiedMoistureLower: 0.19,
  callerVerifiedMoistureUpper: 0.22,
  callerRequiredWitnessedHoldHours: 3,
} satisfies Input;
export const exampleOutput = {
  witnessedQualificationStartHours: [1],
  witnessedQualifiedHoldHours: [4],
  noWitnessedQualifyingHold: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/flooring-acclimation-time",
  title: "Flooring Acclimation Time Calculator",
  description:
    "Caller explicit in-band moisture hold witnessed between consecutive actual samples, no sub-sample/unsampled hold guarantee, manufacturer installation readiness external. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "witnessedQualificationStartHours",
      label: "Witnessed qualification start hours",
      kind: "numberList",
    },
    {
      id: "witnessedQualifiedHoldHours",
      label: "Witnessed qualified hold hours",
      kind: "numberList",
    },
    {
      id: "noWitnessedQualifyingHold",
      label: "No witnessed qualifying hold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAcclimationElapsedHours:
        value.observedAcclimationElapsedHours as readonly number[],
      observedFlooringMoistureFractions:
        value.observedFlooringMoistureFractions as readonly number[],
      callerVerifiedMoistureLower: value.callerVerifiedMoistureLower as number,
      callerVerifiedMoistureUpper: value.callerVerifiedMoistureUpper as number,
      callerRequiredWitnessedHoldHours:
        value.callerRequiredWitnessedHoldHours as number,
    }),
});
export const run = tool.execute;
export default tool;
