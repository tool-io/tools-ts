import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  capacity,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVacuumBreakerIds: readonly string[];
  readonly callerMatchedAirAdmissionCapacityLitersSecond: readonly number[];
  readonly callerIndependentlyEstablishedAirAdmissionLitersSecond: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleCandidateIds: readonly string[];
  readonly signedCandidateCapacityMarginsLitersSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "callerVacuumBreakerIds",
    label: "Caller vacuum breaker ids",
    kind: "stringList",
  },
  {
    id: "callerMatchedAirAdmissionCapacityLitersSecond",
    label: "Caller matched air admission capacity liters second",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedAirAdmissionLitersSecond",
    label: "Caller independently established air admission liters second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedAirAdmissionCapacityLitersSecond.forEach((v) =>
    nonnegative(v, "callerMatchedAirAdmissionCapacityLitersSecond"),
  );
  nonnegative(
    input.callerIndependentlyEstablishedAirAdmissionLitersSecond,
    "callerIndependentlyEstablishedAirAdmissionLitersSecond",
  );
  return {
    callerCompatibleCandidateIds: capacity(
      input.callerVacuumBreakerIds,
      input.callerMatchedAirAdmissionCapacityLitersSecond,
      input.callerIndependentlyEstablishedAirAdmissionLitersSecond,
    ),
    signedCandidateCapacityMarginsLitersSecond:
      input.callerMatchedAirAdmissionCapacityLitersSecond.map(
        (v) => v - input.callerIndependentlyEstablishedAirAdmissionLitersSecond,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVacuumBreakerIds: ["a", "b", "c"],
  callerMatchedAirAdmissionCapacityLitersSecond: [5, 10, 20],
  callerIndependentlyEstablishedAirAdmissionLitersSecond: 8,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleCandidateIds: ["b", "c"],
  signedCandidateCapacityMarginsLitersSecond: [-3, 2, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/vacuum-breaker-size",
  title: "Plumbing Vacuum Breaker Size Calculator",
  description:
    "Compare independently established vacuum air admission demand against matched differential-pressure breaker capacities; no assumed pipe drainage or water-column transient, potable backflow/vacuum protection approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleCandidateIds",
      label: "Caller compatible candidate ids",
      kind: "stringList",
    },
    {
      id: "signedCandidateCapacityMarginsLitersSecond",
      label: "Signed candidate capacity margins liters second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVacuumBreakerIds: value.callerVacuumBreakerIds as readonly string[],
      callerMatchedAirAdmissionCapacityLitersSecond:
        value.callerMatchedAirAdmissionCapacityLitersSecond as readonly number[],
      callerIndependentlyEstablishedAirAdmissionLitersSecond:
        value.callerIndependentlyEstablishedAirAdmissionLitersSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
