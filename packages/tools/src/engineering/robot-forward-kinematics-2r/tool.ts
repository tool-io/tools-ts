import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly linkLengthsM: readonly number[];
  readonly jointAnglesRad: readonly number[];
}>;
export type Output = Readonly<{ readonly endEffectorXyM: readonly number[] }>;
const inputFields = [
  { id: "linkLengthsM", label: "Link lengths m", kind: "numberList" },
  { id: "jointAnglesRad", label: "Joint angles rad", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.linkLengthsM.length !== 2 || input.jointAnglesRad.length !== 2)
    simpleError("2R", "Exactly two planar links and relative joint angles.");
  input.linkLengthsM.forEach((v) => positive(v, "link"));
  const [l1, l2] = input.linkLengthsM,
    [q1, q2] = input.jointAnglesRad;
  return {
    endEffectorXyM: [
      l1 * Math.cos(q1) + l2 * Math.cos(q1 + q2),
      l1 * Math.sin(q1) + l2 * Math.sin(q1 + q2),
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  linkLengthsM: [2, 1],
  jointAnglesRad: [0, 1.5707963267948966],
} satisfies Input;
export const exampleOutput = { endEffectorXyM: [2, 1] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/robot-forward-kinematics-2r",
  title: "2R Robot Forward Kinematics Calculator",
  description:
    "Planar2R fixed-base forward kinematics, second angle relative to first link, no motion command or obstacle safety. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "endEffectorXyM", label: "End effector xy m", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      linkLengthsM: value.linkLengthsM as readonly number[],
      jointAnglesRad: value.jointAnglesRad as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
