import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredAvailableRootLengthMm: number;
  readonly callerClinicianEstablishedRequiredApicalRetainedLengthMm: number;
  readonly actualMeasuredPostSpaceDepthMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredAvailableRootLengthMm",
    label: "Independently measured available root length mm",
    kind: "number",
  },
  {
    id: "callerClinicianEstablishedRequiredApicalRetainedLengthMm",
    label: "Caller clinician established required apical retained length mm",
    kind: "number",
  },
  {
    id: "actualMeasuredPostSpaceDepthMm",
    label: "Actual measured post space depth mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.independentlyMeasuredAvailableRootLengthMm,
    input.callerClinicianEstablishedRequiredApicalRetainedLengthMm,
    input.actualMeasuredPostSpaceDepthMm,
  ].forEach((v) => nonnegative(v, "length"));
  const c =
    input.independentlyMeasuredAvailableRootLengthMm -
    input.callerClinicianEstablishedRequiredApicalRetainedLengthMm;
  if (c < 0)
    simpleError(
      "geometry",
      "Caller retained length within available geometry.",
    );
  return {
    conditionalCallerGeometricPostSpaceCeilingMm: c,
    signedDepthMarginMm: c - input.actualMeasuredPostSpaceDepthMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAvailableRootLengthMm: 15,
    callerClinicianEstablishedRequiredApicalRetainedLengthMm: 5,
    actualMeasuredPostSpaceDepthMm: 8,
  },
  output: {
    result: {
      conditionalCallerGeometricPostSpaceCeilingMm: 10,
      signedDepthMarginMm: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/post-space-depth-rule",
  title: "Post Space Depth Rule Calculator",
  description:
    "Caller-established retained apical length subtracted from independently measured available root length, compared to actual post-space depth. Not universal two-thirds rule, adequate seal, strength or permission to prepare a post.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
