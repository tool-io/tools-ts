import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  capacity,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerReliefValveIds: readonly string[];
  readonly callerVerifiedMatchedRelievingMassKgHour: readonly number[];
  readonly callerIndependentlyEstablishedReliefLoadKgHour: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleCandidateIds: readonly string[];
  readonly signedCandidateCapacityMarginsKgHour: readonly number[];
}>;
const inputFields = [
  {
    id: "callerReliefValveIds",
    label: "Caller relief valve ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMatchedRelievingMassKgHour",
    label: "Caller verified matched relieving mass kg hour",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedReliefLoadKgHour",
    label: "Caller independently established relief load kg hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMatchedRelievingMassKgHour.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedRelievingMassKgHour"),
  );
  nonnegative(
    input.callerIndependentlyEstablishedReliefLoadKgHour,
    "callerIndependentlyEstablishedReliefLoadKgHour",
  );
  return {
    callerCompatibleCandidateIds: capacity(
      input.callerReliefValveIds,
      input.callerVerifiedMatchedRelievingMassKgHour,
      input.callerIndependentlyEstablishedReliefLoadKgHour,
    ),
    signedCandidateCapacityMarginsKgHour:
      input.callerVerifiedMatchedRelievingMassKgHour.map(
        (v) => v - input.callerIndependentlyEstablishedReliefLoadKgHour,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerReliefValveIds: ["a", "b", "c"],
  callerVerifiedMatchedRelievingMassKgHour: [5, 10, 20],
  callerIndependentlyEstablishedReliefLoadKgHour: 8,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleCandidateIds: ["b", "c"],
  signedCandidateCapacityMarginsKgHour: [-3, 2, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pressure-relief-valve-sizing",
  title: "Plumbing Pressure Relief Valve Sizing Calculator",
  description:
    "Compare independently established relieving mass load against caller verified same-fluid/backpressure relief-valve capacities; no relief-load derivation, universal orifice formula, pressure vessel sizing approval or operating instructions.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleCandidateIds",
      label: "Caller compatible candidate ids",
      kind: "stringList",
    },
    {
      id: "signedCandidateCapacityMarginsKgHour",
      label: "Signed candidate capacity margins kg hour",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerReliefValveIds: value.callerReliefValveIds as readonly string[],
      callerVerifiedMatchedRelievingMassKgHour:
        value.callerVerifiedMatchedRelievingMassKgHour as readonly number[],
      callerIndependentlyEstablishedReliefLoadKgHour:
        value.callerIndependentlyEstablishedReliefLoadKgHour as number,
    }),
});
export const run = tool.execute;
export default tool;
