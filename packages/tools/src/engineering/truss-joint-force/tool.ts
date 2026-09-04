import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape, solve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly memberDirectionCosines: readonly (readonly number[])[];
  readonly externalJointForce: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedMemberForces: readonly number[];
}>;
const inputFields = [
  {
    id: "memberDirectionCosines",
    label: "Member direction cosines",
    kind: "matrix",
  },
  {
    id: "externalJointForce",
    label: "External joint force",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    shape(input.memberDirectionCosines, "members") !== 2 ||
    input.memberDirectionCosines.length !== 2 ||
    input.externalJointForce.length !== 2
  )
    simpleError(
      "joint",
      "Two unknown planar members and explicit externalXY load.",
    );
  input.memberDirectionCosines.forEach((r) => {
    if (Math.abs(Math.hypot(r[0], r[1]) - 1) > 1e-10)
      simpleError("direction", "Unit member vectors directed away from joint.");
  });
  return {
    signedMemberForces: solve(
      [
        [
          input.memberDirectionCosines[0][0],
          input.memberDirectionCosines[1][0],
        ],
        [
          input.memberDirectionCosines[0][1],
          input.memberDirectionCosines[1][1],
        ],
      ],
      input.externalJointForce.map((v) => -v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  memberDirectionCosines: [
    [1, 0],
    [0, 1],
  ],
  externalJointForce: [-3, -4],
} satisfies Input;
export const exampleOutput = { signedMemberForces: [3, 4] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/truss-joint-force",
  title: "Truss Joint Force Calculator",
  description:
    "Solve a determinate two-member planar truss joint with tension positive; not a whole-truss or support stability solution. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedMemberForces",
      label: "Signed member forces",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      memberDirectionCosines:
        value.memberDirectionCosines as readonly (readonly number[])[],
      externalJointForce: value.externalJointForce as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
