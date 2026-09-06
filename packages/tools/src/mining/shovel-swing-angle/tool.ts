import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedShovelHeadingDegrees: readonly number[];
  readonly callerMaximumAbsoluteSwingDegrees: number;
}>;
export type Output = Readonly<{
  readonly signedShortestObservedSwingsDegrees: readonly number[];
  readonly swingReviewIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedShovelHeadingDegrees",
    label: "Observed shovel heading degrees",
    kind: "numberList",
  },
  {
    id: "callerMaximumAbsoluteSwingDegrees",
    label: "Caller maximum absolute swing degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMaximumAbsoluteSwingDegrees,
    "callerMaximumAbsoluteSwingDegrees",
  );
  if (
    input.observedShovelHeadingDegrees.length < 2 ||
    input.observedShovelHeadingDegrees.some((v) => v < 0 || v >= 360) ||
    input.callerMaximumAbsoluteSwingDegrees > 180
  )
    simpleError(
      "headings",
      "At least two headings[0,360), swing threshold≤180.",
    );
  const d = input.observedShovelHeadingDegrees
    .slice(1)
    .map(
      (v, i) => ((v - input.observedShovelHeadingDegrees[i] + 540) % 360) - 180,
    );
  return {
    signedShortestObservedSwingsDegrees: d,
    swingReviewIndices: d.flatMap((v, i) =>
      Math.abs(v) > input.callerMaximumAbsoluteSwingDegrees ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShovelHeadingDegrees: [350, 10, 190],
  callerMaximumAbsoluteSwingDegrees: 90,
} satisfies Input;
export const exampleOutput = {
  signedShortestObservedSwingsDegrees: [20, -180],
  swingReviewIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/shovel-swing-angle",
  title: "Shovel Swing Angle Calculator",
  description:
    "Audit actual successive shovel heading shortest signed swings with explicit180° tie=−180 convention, not productive cycle estimate or permissible slewing command. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedShortestObservedSwingsDegrees",
      label: "Signed shortest observed swings degrees",
      kind: "numberList",
    },
    {
      id: "swingReviewIndices",
      label: "Swing review indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShovelHeadingDegrees:
        value.observedShovelHeadingDegrees as readonly number[],
      callerMaximumAbsoluteSwingDegrees:
        value.callerMaximumAbsoluteSwingDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
