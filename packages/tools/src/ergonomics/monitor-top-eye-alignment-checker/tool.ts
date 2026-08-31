import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, range } from "../shared.js";
export type Input = Readonly<{
  readonly measuredEyeHeightCm: number;
  readonly measuredScreenTopCm: number;
  readonly callerAllowedTopMinusEyeBoundsCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedScreenTopMinusEyeCm: number;
  readonly withinCallerAlignmentBounds: boolean;
  readonly nearestPolicyAdjustmentCm: number;
}>;
const inputFields = [
  {
    id: "measuredEyeHeightCm",
    label: "Measured eye height cm",
    kind: "number",
  },
  {
    id: "measuredScreenTopCm",
    label: "Measured screen top cm",
    kind: "number",
  },
  {
    id: "callerAllowedTopMinusEyeBoundsCm",
    label: "Caller allowed top minus eye bounds cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.measuredEyeHeightCm, "measuredEyeHeightCm");
  nonnegative(input.measuredScreenTopCm, "measuredScreenTopCm");
  range(input.callerAllowedTopMinusEyeBoundsCm, "alignmentBounds");
  const d = input.measuredScreenTopCm - input.measuredEyeHeightCm,
    target = Math.max(
      input.callerAllowedTopMinusEyeBoundsCm[0],
      Math.min(input.callerAllowedTopMinusEyeBoundsCm[1], d),
    );
  return {
    signedScreenTopMinusEyeCm: d,
    withinCallerAlignmentBounds: d === target,
    nearestPolicyAdjustmentCm: target - d,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredEyeHeightCm: 120,
  measuredScreenTopCm: 125,
  callerAllowedTopMinusEyeBoundsCm: [-5, 0],
} satisfies Input;
export const exampleOutput = {
  signedScreenTopMinusEyeCm: 5,
  withinCallerAlignmentBounds: false,
  nearestPolicyAdjustmentCm: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/monitor-top-eye-alignment-checker",
  title: "Monitor Top-at-Eye Height Alignment Checker",
  description:
    "Audit measured screen top relative to actual seated eye datum under caller allowed offset, preserving signed displacement; not ideal monitor-height prescription or visual-health assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedScreenTopMinusEyeCm",
      label: "Signed screen top minus eye cm",
      kind: "number",
    },
    {
      id: "withinCallerAlignmentBounds",
      label: "Within caller alignment bounds",
      kind: "boolean",
    },
    {
      id: "nearestPolicyAdjustmentCm",
      label: "Nearest policy adjustment cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredEyeHeightCm: value.measuredEyeHeightCm as number,
      measuredScreenTopCm: value.measuredScreenTopCm as number,
      callerAllowedTopMinusEyeBoundsCm:
        value.callerAllowedTopMinusEyeBoundsCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
