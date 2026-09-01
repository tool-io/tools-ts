import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  capacity,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerHangerRodIds: readonly string[];
  readonly callerVerifiedMatchedRodAllowableN: readonly number[];
  readonly observedIndependentHangerDemandN: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleCandidateIds: readonly string[];
  readonly signedCandidateCapacityMarginsN: readonly number[];
}>;
const inputFields = [
  {
    id: "callerHangerRodIds",
    label: "Caller hanger rod ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMatchedRodAllowableN",
    label: "Caller verified matched rod allowable n",
    kind: "numberList",
  },
  {
    id: "observedIndependentHangerDemandN",
    label: "Observed independent hanger demand n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMatchedRodAllowableN.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedRodAllowableN"),
  );
  nonnegative(
    input.observedIndependentHangerDemandN,
    "observedIndependentHangerDemandN",
  );
  return {
    callerCompatibleCandidateIds: capacity(
      input.callerHangerRodIds,
      input.callerVerifiedMatchedRodAllowableN,
      input.observedIndependentHangerDemandN,
    ),
    signedCandidateCapacityMarginsN:
      input.callerVerifiedMatchedRodAllowableN.map(
        (v) => v - input.observedIndependentHangerDemandN,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHangerRodIds: ["a", "b", "c"],
  callerVerifiedMatchedRodAllowableN: [5, 10, 20],
  observedIndependentHangerDemandN: 8,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleCandidateIds: ["b", "c"],
  signedCandidateCapacityMarginsN: [-3, 2, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/hanger-rod-size",
  title: "Plumbing Hanger Rod Size Calculator",
  description:
    "Screen actual independent hanger demand against caller verified rod assembly/tension/temperature capacities; no inferred thread-root stress or installation/structural approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleCandidateIds",
      label: "Caller compatible candidate ids",
      kind: "stringList",
    },
    {
      id: "signedCandidateCapacityMarginsN",
      label: "Signed candidate capacity margins n",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerHangerRodIds: value.callerHangerRodIds as readonly string[],
      callerVerifiedMatchedRodAllowableN:
        value.callerVerifiedMatchedRodAllowableN as readonly number[],
      observedIndependentHangerDemandN:
        value.observedIndependentHangerDemandN as number,
    }),
});
export const run = tool.execute;
export default tool;
