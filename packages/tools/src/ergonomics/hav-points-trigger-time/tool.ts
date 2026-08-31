import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredWeightedRmsAcceleration: number;
  readonly callerReferenceAcceleration: number;
  readonly callerPointsPerReferenceHour: number;
  readonly alreadyAccumulatedPoints: number;
  readonly callerPointBudget: number;
}>;
export type Output = Readonly<{
  readonly modeledPointsPerHour: number;
  readonly signedRemainingPointBudget: number;
  readonly maximumNonnegativeAdditionalHours: number;
}>;
const inputFields = [
  {
    id: "measuredWeightedRmsAcceleration",
    label: "Measured weighted rms acceleration",
    kind: "number",
  },
  {
    id: "callerReferenceAcceleration",
    label: "Caller reference acceleration",
    kind: "number",
  },
  {
    id: "callerPointsPerReferenceHour",
    label: "Caller points per reference hour",
    kind: "number",
  },
  {
    id: "alreadyAccumulatedPoints",
    label: "Already accumulated points",
    kind: "number",
  },
  { id: "callerPointBudget", label: "Caller point budget", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.measuredWeightedRmsAcceleration,
    "measuredWeightedRmsAcceleration",
  );
  positive(input.callerReferenceAcceleration, "callerReferenceAcceleration");
  positive(input.callerPointsPerReferenceHour, "callerPointsPerReferenceHour");
  nonnegative(input.alreadyAccumulatedPoints, "alreadyAccumulatedPoints");
  nonnegative(input.callerPointBudget, "callerPointBudget");
  const rate =
      input.callerPointsPerReferenceHour *
      (input.measuredWeightedRmsAcceleration /
        input.callerReferenceAcceleration) **
        2,
    left = input.callerPointBudget - input.alreadyAccumulatedPoints;
  return {
    modeledPointsPerHour: rate,
    signedRemainingPointBudget: left,
    maximumNonnegativeAdditionalHours:
      Math.max(0, left) / positive(rate, "rate"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredWeightedRmsAcceleration: 5,
  callerReferenceAcceleration: 2.5,
  callerPointsPerReferenceHour: 12.5,
  alreadyAccumulatedPoints: 50,
  callerPointBudget: 100,
} satisfies Input;
export const exampleOutput = {
  modeledPointsPerHour: 50,
  signedRemainingPointBudget: 50,
  maximumNonnegativeAdditionalHours: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/hav-points-trigger-time",
  title: "HAV Points per Hour Trigger Time Calculator",
  description:
    "Invert explicit caller vibration point calibration/budget after actual accumulated dose, preserving overdraw; not a hidden regulatory action threshold or permitted trigger-time recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledPointsPerHour",
      label: "Modeled points per hour",
      kind: "number",
    },
    {
      id: "signedRemainingPointBudget",
      label: "Signed remaining point budget",
      kind: "number",
    },
    {
      id: "maximumNonnegativeAdditionalHours",
      label: "Maximum nonnegative additional hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredWeightedRmsAcceleration:
        value.measuredWeightedRmsAcceleration as number,
      callerReferenceAcceleration: value.callerReferenceAcceleration as number,
      callerPointsPerReferenceHour:
        value.callerPointsPerReferenceHour as number,
      alreadyAccumulatedPoints: value.alreadyAccumulatedPoints as number,
      callerPointBudget: value.callerPointBudget as number,
    }),
});
export const run = tool.execute;
export default tool;
