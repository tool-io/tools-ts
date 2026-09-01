import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerCombinationAirValveIds: readonly string[];
  readonly callerMatchedAdmissionLitersSecond: readonly number[];
  readonly callerMatchedExpulsionLitersSecond: readonly number[];
  readonly callerRequiredAdmissionLitersSecond: number;
  readonly callerRequiredExpulsionLitersSecond: number;
}>;
export type Output = Readonly<{
  readonly callerBidirectionallyCompatibleAirValveIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerCombinationAirValveIds",
    label: "Caller combination air valve ids",
    kind: "stringList",
  },
  {
    id: "callerMatchedAdmissionLitersSecond",
    label: "Caller matched admission liters second",
    kind: "numberList",
  },
  {
    id: "callerMatchedExpulsionLitersSecond",
    label: "Caller matched expulsion liters second",
    kind: "numberList",
  },
  {
    id: "callerRequiredAdmissionLitersSecond",
    label: "Caller required admission liters second",
    kind: "number",
  },
  {
    id: "callerRequiredExpulsionLitersSecond",
    label: "Caller required expulsion liters second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedAdmissionLitersSecond.forEach((v) =>
    nonnegative(v, "callerMatchedAdmissionLitersSecond"),
  );
  input.callerMatchedExpulsionLitersSecond.forEach((v) =>
    nonnegative(v, "callerMatchedExpulsionLitersSecond"),
  );
  nonnegative(
    input.callerRequiredAdmissionLitersSecond,
    "callerRequiredAdmissionLitersSecond",
  );
  nonnegative(
    input.callerRequiredExpulsionLitersSecond,
    "callerRequiredExpulsionLitersSecond",
  );
  aligned(
    input.callerCombinationAirValveIds,
    input.callerMatchedAdmissionLitersSecond,
    "callerCombinationAirValveIds",
  );
  aligned(
    input.callerCombinationAirValveIds,
    input.callerMatchedExpulsionLitersSecond,
    "callerCombinationAirValveIds",
  );
  unique(input.callerCombinationAirValveIds, "valves");
  return {
    callerBidirectionallyCompatibleAirValveIds:
      input.callerCombinationAirValveIds.filter(
        (_, i) =>
          input.callerMatchedAdmissionLitersSecond[i] >=
            input.callerRequiredAdmissionLitersSecond &&
          input.callerMatchedExpulsionLitersSecond[i] >=
            input.callerRequiredExpulsionLitersSecond,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCombinationAirValveIds: ["a", "b"],
  callerMatchedAdmissionLitersSecond: [10, 20],
  callerMatchedExpulsionLitersSecond: [20, 10],
  callerRequiredAdmissionLitersSecond: 15,
  callerRequiredExpulsionLitersSecond: 15,
} satisfies Input;
export const exampleOutput = {
  callerBidirectionallyCompatibleAirValveIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/combination-air-valve-size",
  title: "Plumbing Combination Air Valve Size Calculator",
  description:
    "Screen actual combination air-valve matched admission/expulsion capacities separately, preserving no match; not one-direction vacuum breaker or vent type recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerBidirectionallyCompatibleAirValveIds",
      label: "Caller bidirectionally compatible air valve ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCombinationAirValveIds:
        value.callerCombinationAirValveIds as readonly string[],
      callerMatchedAdmissionLitersSecond:
        value.callerMatchedAdmissionLitersSecond as readonly number[],
      callerMatchedExpulsionLitersSecond:
        value.callerMatchedExpulsionLitersSecond as readonly number[],
      callerRequiredAdmissionLitersSecond:
        value.callerRequiredAdmissionLitersSecond as number,
      callerRequiredExpulsionLitersSecond:
        value.callerRequiredExpulsionLitersSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
