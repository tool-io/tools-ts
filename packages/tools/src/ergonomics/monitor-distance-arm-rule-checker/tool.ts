import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedEyeScreenDistanceCm: number;
  readonly observedArmLengthCm: number;
  readonly callerRatioLower: number;
  readonly callerRatioUpper: number;
}>;
export type Output = Readonly<{
  readonly distanceArmRatio: number;
  readonly signedRatioMargin: number;
}>;
const inputFields = [
  {
    id: "observedEyeScreenDistanceCm",
    label: "Observed eye screen distance cm",
    kind: "number",
  },
  {
    id: "observedArmLengthCm",
    label: "Observed arm length cm",
    kind: "number",
  },
  { id: "callerRatioLower", label: "Caller ratio lower", kind: "number" },
  { id: "callerRatioUpper", label: "Caller ratio upper", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedEyeScreenDistanceCm, "observedEyeScreenDistanceCm");
  positive(input.observedArmLengthCm, "observedArmLengthCm");
  nonnegative(input.callerRatioLower, "callerRatioLower");
  nonnegative(input.callerRatioUpper, "callerRatioUpper");
  ordered(input.callerRatioLower, input.callerRatioUpper);
  const r = input.observedEyeScreenDistanceCm / input.observedArmLengthCm;
  return {
    distanceArmRatio: r,
    signedRatioMargin: Math.min(
      r - input.callerRatioLower,
      input.callerRatioUpper - r,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEyeScreenDistanceCm: 60,
  observedArmLengthCm: 50,
  callerRatioLower: 0.8,
  callerRatioUpper: 1.4,
} satisfies Input;
export const exampleOutput = {
  distanceArmRatio: 1.2,
  signedRatioMargin: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/monitor-distance-arm-rule-checker",
  title: "Monitor Viewing Distance Arm-Length Rule Checker",
  description:
    "Measured viewing/arm ratio against caller comfort policy, not optical accommodation or monitor placement prescription. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "distanceArmRatio", label: "Distance arm ratio", kind: "number" },
    { id: "signedRatioMargin", label: "Signed ratio margin", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedEyeScreenDistanceCm: value.observedEyeScreenDistanceCm as number,
      observedArmLengthCm: value.observedArmLengthCm as number,
      callerRatioLower: value.callerRatioLower as number,
      callerRatioUpper: value.callerRatioUpper as number,
    }),
});
export const run = tool.execute;
export default tool;
