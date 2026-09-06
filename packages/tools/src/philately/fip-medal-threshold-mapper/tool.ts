import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, referenceBands } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedPoints: number;
  readonly callerVerifiedThresholdLower: readonly number[];
  readonly callerVerifiedThresholdUpper: readonly number[];
  readonly callerVerifiedMedalLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchingCallerMedalLabels: readonly string[];
}>;
const inputFields = [
  { id: "observedPoints", label: "Observed points", kind: "number" },
  {
    id: "callerVerifiedThresholdLower",
    label: "Caller verified threshold lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedThresholdUpper",
    label: "Caller verified threshold upper",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMedalLabels",
    label: "Caller verified medal labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchingCallerMedalLabels: referenceBands(
      input.observedPoints,
      input.callerVerifiedThresholdLower,
      input.callerVerifiedThresholdUpper,
      input.callerVerifiedMedalLabels,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPoints: 95,
  callerVerifiedThresholdLower: [60, 95],
  callerVerifiedThresholdUpper: [95, 101],
  callerVerifiedMedalLabels: ["caller-medal-a", "caller-medal-b"],
} satisfies Input;
export const exampleOutput = {
  matchingCallerMedalLabels: ["caller-medal-b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/fip-medal-threshold-mapper",
  title: "FIP Medal Threshold Points Mapper (95-60)",
  description:
    "Map observed exhibit points to caller independently verified FIP edition/category half-open medal thresholds; overlapping matches retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingCallerMedalLabels",
      label: "Matching caller medal labels",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPoints: value.observedPoints as number,
      callerVerifiedThresholdLower:
        value.callerVerifiedThresholdLower as readonly number[],
      callerVerifiedThresholdUpper:
        value.callerVerifiedThresholdUpper as readonly number[],
      callerVerifiedMedalLabels:
        value.callerVerifiedMedalLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
