import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly linkLengthsM: readonly number[];
  readonly targetXyM: readonly number[];
}>;
export type Output = Readonly<{
  readonly elbowUpAnglesRad: readonly number[];
  readonly elbowDownAnglesRad: readonly number[];
}>;
const inputFields = [
  { id: "linkLengthsM", label: "Link lengths m", kind: "numberList" },
  { id: "targetXyM", label: "Target xy m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.linkLengthsM.length !== 2 || input.targetXyM.length !== 2)
    simpleError("2R", "Two positive links and actual targetXY.");
  input.linkLengthsM.forEach((v) => positive(v, "link"));
  const [a, b] = input.linkLengthsM,
    [x, y] = input.targetXyM;
  if (Math.hypot(x, y) === 0)
    simpleError(
      "origin",
      "Origin solution not unique; independently select branch outside tool.",
    );
  const c = (x * x + y * y - a * a - b * b) / (2 * a * b);
  if (c < -1 || c > 1)
    simpleError("reach", "Target outside exact annular reach, no clipping.");
  const q = Math.acos(c),
    branch = (q2: number) => [
      Math.atan2(y, x) - Math.atan2(b * Math.sin(q2), a + b * Math.cos(q2)),
      q2,
    ];
  return { elbowUpAnglesRad: branch(q), elbowDownAnglesRad: branch(-q) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  linkLengthsM: [1, 1],
  targetXyM: [1, 1],
} satisfies Input;
export const exampleOutput = {
  elbowUpAnglesRad: [0, 1.5707963267948966],
  elbowDownAnglesRad: [1.5707963267948966, -1.5707963267948966],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/robot-inverse-kinematics-2r",
  title: "2R Robot Inverse Kinematics Calculator",
  description:
    "Planar2R analytic inverse, both elbow branches retained, origin degeneracy refused; limits/collision checks not inferred. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "elbowUpAnglesRad",
      label: "Elbow up angles rad",
      kind: "numberList",
    },
    {
      id: "elbowDownAnglesRad",
      label: "Elbow down angles rad",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      linkLengthsM: value.linkLengthsM as readonly number[],
      targetXyM: value.targetXyM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
