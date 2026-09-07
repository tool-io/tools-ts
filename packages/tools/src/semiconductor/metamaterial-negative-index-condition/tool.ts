import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedRealRelativePermittivity: readonly number[];
  readonly observedRealRelativePermeability: readonly number[];
  readonly callerLowLossIsotropicBranchVerified: boolean;
}>;
export type Output = Readonly<{
  readonly doubleNegativeCandidateFlags: readonly number[];
  readonly singleNegativeEvanescentCandidateFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRealRelativePermittivity",
    label: "Observed real relative permittivity",
    kind: "numberList",
  },
  {
    id: "observedRealRelativePermeability",
    label: "Observed real relative permeability",
    kind: "numberList",
  },
  {
    id: "callerLowLossIsotropicBranchVerified",
    label: "Caller low loss isotropic branch verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedRealRelativePermittivity,
    input.observedRealRelativePermeability,
    "observedRealRelativePermittivity",
  );
  if (!input.callerLowLossIsotropicBranchVerified)
    simpleError(
      "branch",
      "Independent low-loss isotropic branch evidence required.",
    );
  return {
    doubleNegativeCandidateFlags: input.observedRealRelativePermittivity.map(
      (v, i) =>
        v < 0 && input.observedRealRelativePermeability[i] < 0 ? 1 : 0,
    ),
    singleNegativeEvanescentCandidateFlags:
      input.observedRealRelativePermittivity.map((v, i) =>
        v * input.observedRealRelativePermeability[i] < 0 ? 1 : 0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRealRelativePermittivity: [-2, 2, -2],
  observedRealRelativePermeability: [-3, -3, 3],
  callerLowLossIsotropicBranchVerified: true,
} satisfies Input;
export const exampleOutput = {
  doubleNegativeCandidateFlags: [1, 0, 0],
  singleNegativeEvanescentCandidateFlags: [0, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/metamaterial-negative-index-condition",
  title: "Semiconductor Metamaterial Negative Index Condition Calculator",
  description:
    "Screen actual ε/μ signs only on caller verified low-loss isotropic branch, double-negative candidate not a causality/passivity or full complex negative-index certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "doubleNegativeCandidateFlags",
      label: "Double negative candidate flags",
      kind: "numberList",
    },
    {
      id: "singleNegativeEvanescentCandidateFlags",
      label: "Single negative evanescent candidate flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRealRelativePermittivity:
        value.observedRealRelativePermittivity as readonly number[],
      observedRealRelativePermeability:
        value.observedRealRelativePermeability as readonly number[],
      callerLowLossIsotropicBranchVerified:
        value.callerLowLossIsotropicBranchVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
