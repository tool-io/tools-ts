import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly dhLinkLengthM: number;
  readonly dhLinkTwistRad: number;
  readonly dhLinkOffsetM: number;
  readonly dhJointAngleRad: number;
}>;
export type Output = Readonly<{
  readonly standardDhTransform: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "dhLinkLengthM", label: "Dh link length m", kind: "number" },
  { id: "dhLinkTwistRad", label: "Dh link twist rad", kind: "number" },
  { id: "dhLinkOffsetM", label: "Dh link offset m", kind: "number" },
  { id: "dhJointAngleRad", label: "Dh joint angle rad", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    Math.abs(input.dhLinkLengthM) > 1e6 ||
    Math.abs(input.dhLinkOffsetM) > 1e6
  )
    simpleError("length", "Bounded local DH translations≤1e6m.");
  const c = Math.cos(input.dhJointAngleRad),
    s = Math.sin(input.dhJointAngleRad),
    ca = Math.cos(input.dhLinkTwistRad),
    sa = Math.sin(input.dhLinkTwistRad);
  return {
    standardDhTransform: [
      [c, -s * ca, s * sa, input.dhLinkLengthM * c],
      [s, c * ca, -c * sa, input.dhLinkLengthM * s],
      [0, sa, ca, input.dhLinkOffsetM],
      [0, 0, 0, 1],
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dhLinkLengthM: 2,
  dhLinkTwistRad: 0,
  dhLinkOffsetM: 3,
  dhJointAngleRad: 0,
} satisfies Input;
export const exampleOutput = {
  standardDhTransform: [
    [1, 0, 0, 2],
    [0, 1, 0, 0],
    [0, 0, 1, 3],
    [0, 0, 0, 1],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/dh-transformation",
  title: "DH Transformation Calculator",
  description:
    "STANDARD DH RotZθ TransZd TransXa RotXα, not modified DH, coordinate interpretation independently established. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "standardDhTransform",
      label: "Standard dh transform",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      dhLinkLengthM: value.dhLinkLengthM as number,
      dhLinkTwistRad: value.dhLinkTwistRad as number,
      dhLinkOffsetM: value.dhLinkOffsetM as number,
      dhJointAngleRad: value.dhJointAngleRad as number,
    }),
});
export const run = tool.execute;
export default tool;
