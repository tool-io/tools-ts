import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, solve } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerStrutTieEquilibriumMatrix: readonly (readonly number[])[];
  readonly callerExternalEquilibriumRhs: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedStrutTieForces: readonly number[];
}>;
const inputFields = [
  {
    id: "callerStrutTieEquilibriumMatrix",
    label: "Caller strut tie equilibrium matrix",
    kind: "matrix",
  },
  {
    id: "callerExternalEquilibriumRhs",
    label: "Caller external equilibrium rhs",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    signedStrutTieForces: solve(
      input.callerStrutTieEquilibriumMatrix,
      input.callerExternalEquilibriumRhs,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerStrutTieEquilibriumMatrix: [
    [1, 0],
    [1, 1],
  ],
  callerExternalEquilibriumRhs: [2, 5],
} satisfies Input;
export const exampleOutput = { signedStrutTieForces: [2, 3] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/strut-and-tie-force",
  title: "Strut-and-Tie Force Calculator",
  description:
    "Solve independently assembled determinate strut-and-tie equilibrium matrix up to32 unknowns, signs follow caller columns; no admissible stress field or code design. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedStrutTieForces",
      label: "Signed strut tie forces",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerStrutTieEquilibriumMatrix:
        value.callerStrutTieEquilibriumMatrix as readonly (readonly number[])[],
      callerExternalEquilibriumRhs:
        value.callerExternalEquilibriumRhs as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
