import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly firstLinkM: number;
  readonly secondLinkM: number;
  readonly relativeSecondJointAngleRad: number;
}>;
export type Output = Readonly<{ readonly signedPlanarJacobianDetM2: number }>;
const inputFields = [
  { id: "firstLinkM", label: "First link m", kind: "number" },
  { id: "secondLinkM", label: "Second link m", kind: "number" },
  {
    id: "relativeSecondJointAngleRad",
    label: "Relative second joint angle rad",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.firstLinkM, "firstLinkM");
  positive(input.secondLinkM, "secondLinkM");
  return {
    signedPlanarJacobianDetM2:
      input.firstLinkM *
      input.secondLinkM *
      Math.sin(input.relativeSecondJointAngleRad),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstLinkM: 2,
  secondLinkM: 3,
  relativeSecondJointAngleRad: 1.5707963267948966,
} satisfies Input;
export const exampleOutput = { signedPlanarJacobianDetM2: 6 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/robot-jacobian-determinant",
  title: "Robot Jacobian Determinant Calculator",
  description:
    "Planar2R Cartesian velocity Jacobian determinant, signed orientation and singularity preserved; not manipulator condition number. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPlanarJacobianDetM2",
      label: "Signed planar jacobian det m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstLinkM: value.firstLinkM as number,
      secondLinkM: value.secondLinkM as number,
      relativeSecondJointAngleRad: value.relativeSecondJointAngleRad as number,
    }),
});
export const run = tool.execute;
export default tool;
