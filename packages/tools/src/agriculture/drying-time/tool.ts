import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  crossings,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedDryingTimesHours: readonly number[];
  readonly observedMatchedWetMoistureFractions: readonly number[];
  readonly callerTargetWetMoistureFraction: number;
}>;
export type Output = Readonly<{
  readonly observedTargetDryingCrossingHours: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDryingTimesHours",
    label: "Observed drying times hours",
    kind: "numberList",
  },
  {
    id: "observedMatchedWetMoistureFractions",
    label: "Observed matched wet moisture fractions",
    kind: "numberList",
  },
  {
    id: "callerTargetWetMoistureFraction",
    label: "Caller target wet moisture fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDryingTimesHours.forEach((v) =>
    nonnegative(v, "observedDryingTimesHours"),
  );
  input.observedMatchedWetMoistureFractions.forEach((v) =>
    fraction(v, "observedMatchedWetMoistureFractions"),
  );
  fraction(
    input.callerTargetWetMoistureFraction,
    "callerTargetWetMoistureFraction",
  );
  return {
    observedTargetDryingCrossingHours: crossings(
      input.observedDryingTimesHours,
      input.observedMatchedWetMoistureFractions,
      input.callerTargetWetMoistureFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDryingTimesHours: [0, 1, 3],
  observedMatchedWetMoistureFractions: [0.5, 0.3, 0.1],
  callerTargetWetMoistureFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  observedTargetDryingCrossingHours: [2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/drying-time",
  title: "Agriculture Drying Time Calculator",
  description:
    "Measured drying target crossing times including recrossings/absence, no assumed drying constant or extrapolated duration. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTargetDryingCrossingHours",
      label: "Observed target drying crossing hours",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDryingTimesHours:
        value.observedDryingTimesHours as readonly number[],
      observedMatchedWetMoistureFractions:
        value.observedMatchedWetMoistureFractions as readonly number[],
      callerTargetWetMoistureFraction:
        value.callerTargetWetMoistureFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
