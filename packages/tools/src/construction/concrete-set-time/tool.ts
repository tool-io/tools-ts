import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  crossings,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedInitialSetTimesHours: readonly number[];
  readonly observedInitialSetPenetrationResistanceMpa: readonly number[];
  readonly callerVerifiedInitialSetThresholdMpa: number;
}>;
export type Output = Readonly<{
  readonly observedThresholdWitnessHours: readonly number[];
  readonly noObservedThresholdWitness: boolean;
}>;
const inputFields = [
  {
    id: "observedInitialSetTimesHours",
    label: "Observed initial set times hours",
    kind: "numberList",
  },
  {
    id: "observedInitialSetPenetrationResistanceMpa",
    label: "Observed initial set penetration resistance mpa",
    kind: "numberList",
  },
  {
    id: "callerVerifiedInitialSetThresholdMpa",
    label: "Caller verified initial set threshold mpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedInitialSetTimesHours.forEach((v) =>
    nonnegative(v, "observedInitialSetTimesHours"),
  );
  input.observedInitialSetPenetrationResistanceMpa.forEach((v) =>
    nonnegative(v, "observedInitialSetPenetrationResistanceMpa"),
  );
  nonnegative(
    input.callerVerifiedInitialSetThresholdMpa,
    "callerVerifiedInitialSetThresholdMpa",
  );
  const hits = crossings(
    input.observedInitialSetTimesHours,
    input.observedInitialSetPenetrationResistanceMpa,
    input.callerVerifiedInitialSetThresholdMpa,
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
  observedInitialSetTimesHours: [0, 1, 3],
  observedInitialSetPenetrationResistanceMpa: [0, 2, 6],
  callerVerifiedInitialSetThresholdMpa: 2,
} satisfies Input;
export const exampleOutput = {
  observedThresholdWitnessHours: [1],
  noObservedThresholdWitness: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/concrete-set-time",
  title: "Concrete Set Time Calculator",
  description:
    "Extract actual penetration-resistance initial setting threshold crossings at explicit verified method threshold, multiple witnesses/missing evidence retained, not predicted concrete placement window. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedInitialSetTimesHours:
        value.observedInitialSetTimesHours as readonly number[],
      observedInitialSetPenetrationResistanceMpa:
        value.observedInitialSetPenetrationResistanceMpa as readonly number[],
      callerVerifiedInitialSetThresholdMpa:
        value.callerVerifiedInitialSetThresholdMpa as number,
    }),
});
export const run = tool.execute;
export default tool;
