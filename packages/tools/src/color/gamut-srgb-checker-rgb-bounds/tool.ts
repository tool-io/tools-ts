import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch-shared.js";
export type Input = Readonly<{
  readonly unclippedLinearSrgbChannels: readonly number[];
  readonly callerNumericalTolerance: number;
}>;
export type Output = Readonly<{
  readonly belowLowerBoundChannelIndices: readonly number[];
  readonly aboveUpperBoundChannelIndices: readonly number[];
  readonly insideCallerSrgbBounds: boolean;
}>;
const inputFields = [
  {
    id: "unclippedLinearSrgbChannels",
    label: "Unclipped linear srgb channels",
    kind: "numberList",
  },
  {
    id: "callerNumericalTolerance",
    label: "Caller numerical tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerNumericalTolerance, "callerNumericalTolerance");
  if (
    input.unclippedLinearSrgbChannels.length !== 3 ||
    input.callerNumericalTolerance > 1e-4
  )
    simpleError(
      "bounds",
      "Exactly three finite unclipped linear RGB channels and numerical tolerance ≤1e-4 required.",
    );
  const lo = input.unclippedLinearSrgbChannels.flatMap((v, i) =>
      v < -input.callerNumericalTolerance ? [i] : [],
    ),
    hi = input.unclippedLinearSrgbChannels.flatMap((v, i) =>
      v > 1 + input.callerNumericalTolerance ? [i] : [],
    );
  return {
    belowLowerBoundChannelIndices: lo,
    aboveUpperBoundChannelIndices: hi,
    insideCallerSrgbBounds: lo.length + hi.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unclippedLinearSrgbChannels: [-0.1, 0.5, 1.1],
  callerNumericalTolerance: 0,
} satisfies Input;
export const exampleOutput = {
  belowLowerBoundChannelIndices: [0],
  aboveUpperBoundChannelIndices: [2],
  insideCallerSrgbBounds: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/gamut-srgb-checker-rgb-bounds",
  title: "sRGB Gamut RGB Bounds Checker",
  description:
    "Check caller unclipped linear sRGB channel bounds with tiny explicit numerical tolerance and directional witnesses; unlike clipped converters it preserves out-of-gamut evidence, not rendering intent or perceptual gamut mapping.",
  inputs: inputFields,
  outputs: [
    {
      id: "belowLowerBoundChannelIndices",
      label: "Below lower bound channel indices",
      kind: "numberList",
    },
    {
      id: "aboveUpperBoundChannelIndices",
      label: "Above upper bound channel indices",
      kind: "numberList",
    },
    {
      id: "insideCallerSrgbBounds",
      label: "Inside caller srgb bounds",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      unclippedLinearSrgbChannels:
        value.unclippedLinearSrgbChannels as readonly number[],
      callerNumericalTolerance: value.callerNumericalTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
