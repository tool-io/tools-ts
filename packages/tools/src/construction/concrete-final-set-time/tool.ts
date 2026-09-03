import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedFinalSetTimesHours: readonly number[];
  readonly observedFinalSetPenetrationResistanceMpa: readonly number[];
  readonly callerVerifiedFinalSetThresholdMpa: number;
}>;
export type Output = Readonly<{
  readonly observedThresholdWitnessHours: readonly number[];
  readonly noObservedThresholdWitness: boolean;
}>;
const inputFields = [
  {
    id: "observedFinalSetTimesHours",
    label: "Observed final set times hours",
    kind: "numberList",
  },
  {
    id: "observedFinalSetPenetrationResistanceMpa",
    label: "Observed final set penetration resistance mpa",
    kind: "numberList",
  },
  {
    id: "callerVerifiedFinalSetThresholdMpa",
    label: "Caller verified final set threshold mpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFinalSetTimesHours.forEach((v) =>
    nonnegative(v, "observedFinalSetTimesHours"),
  );
  input.observedFinalSetPenetrationResistanceMpa.forEach((v) =>
    nonnegative(v, "observedFinalSetPenetrationResistanceMpa"),
  );
  nonnegative(
    input.callerVerifiedFinalSetThresholdMpa,
    "callerVerifiedFinalSetThresholdMpa",
  );
  const hits = crossings(
    input.observedFinalSetTimesHours,
    input.observedFinalSetPenetrationResistanceMpa,
    input.callerVerifiedFinalSetThresholdMpa,
  );
  return {
    observedThresholdWitnessHours: hits,
    noObservedThresholdWitness: hits.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFinalSetTimesHours: [0, 1, 3],
  observedFinalSetPenetrationResistanceMpa: [0, 2, 6],
  callerVerifiedFinalSetThresholdMpa: 4,
} satisfies Input;
export const exampleOutput = {
  observedThresholdWitnessHours: [2],
  noObservedThresholdWitness: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/concrete-final-set-time",
  title: "Concrete Final Set Time Calculator",
  description:
    "Extract actual penetration-resistance final setting threshold crossings at explicit verified method threshold, multiple witnesses/missing evidence retained, not predicted concrete placement window. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedThresholdWitnessHours",
      label: "Observed threshold witness hours",
      kind: "numberList",
    },
    {
      id: "noObservedThresholdWitness",
      label: "No observed threshold witness",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFinalSetTimesHours:
        value.observedFinalSetTimesHours as readonly number[],
      observedFinalSetPenetrationResistanceMpa:
        value.observedFinalSetPenetrationResistanceMpa as readonly number[],
      callerVerifiedFinalSetThresholdMpa:
        value.callerVerifiedFinalSetThresholdMpa as number,
    }),
});
export const run = tool.execute;
export default tool;
