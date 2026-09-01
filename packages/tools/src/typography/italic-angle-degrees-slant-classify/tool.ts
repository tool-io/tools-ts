import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly outlineSignedSlantAnglesDegrees: readonly number[];
  readonly callerUprightToleranceDegrees: number;
}>;
export type Output = Readonly<{
  readonly leftLeaningIndices: readonly number[];
  readonly rightLeaningIndices: readonly number[];
  readonly uprightIndices: readonly number[];
  readonly medianSignedSlantDegrees: number;
}>;
const inputFields = [
  {
    id: "outlineSignedSlantAnglesDegrees",
    label: "Outline signed slant angles degrees",
    kind: "numberList",
  },
  {
    id: "callerUprightToleranceDegrees",
    label: "Caller upright tolerance degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerUprightToleranceDegrees,
    "callerUprightToleranceDegrees",
  );
  if (
    !input.outlineSignedSlantAnglesDegrees.length ||
    input.outlineSignedSlantAnglesDegrees.some((v) => Math.abs(v) >= 90)
  )
    simpleError(
      "angles",
      "Nonempty slant angles strictly within (−90,90) required.",
    );
  const a = [...input.outlineSignedSlantAnglesDegrees].sort((a, b) => a - b),
    mid = (a[Math.floor((a.length - 1) / 2)] + a[Math.floor(a.length / 2)]) / 2;
  return {
    leftLeaningIndices: input.outlineSignedSlantAnglesDegrees.flatMap((v, i) =>
      v < -input.callerUprightToleranceDegrees ? [i] : [],
    ),
    rightLeaningIndices: input.outlineSignedSlantAnglesDegrees.flatMap(
      (v, i) => (v > input.callerUprightToleranceDegrees ? [i] : []),
    ),
    uprightIndices: input.outlineSignedSlantAnglesDegrees.flatMap((v, i) =>
      Math.abs(v) <= input.callerUprightToleranceDegrees ? [i] : [],
    ),
    medianSignedSlantDegrees: mid,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  outlineSignedSlantAnglesDegrees: [-12, -10, 0],
  callerUprightToleranceDegrees: 1,
} satisfies Input;
export const exampleOutput = {
  leftLeaningIndices: [0, 1],
  rightLeaningIndices: [],
  uprightIndices: [2],
  medianSignedSlantDegrees: -10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/italic-angle-degrees-slant-classify",
  title: "Italic Angle Degrees Slant Classifier",
  description:
    "Classify measured signed slant geometrically with explicit caller upright tolerance; positive means right in caller convention, no font italic-feature or stylistic authenticity diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "leftLeaningIndices",
      label: "Left leaning indices",
      kind: "numberList",
    },
    {
      id: "rightLeaningIndices",
      label: "Right leaning indices",
      kind: "numberList",
    },
    { id: "uprightIndices", label: "Upright indices", kind: "numberList" },
    {
      id: "medianSignedSlantDegrees",
      label: "Median signed slant degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      outlineSignedSlantAnglesDegrees:
        value.outlineSignedSlantAnglesDegrees as readonly number[],
      callerUprightToleranceDegrees:
        value.callerUprightToleranceDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
