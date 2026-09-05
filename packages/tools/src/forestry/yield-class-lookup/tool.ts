import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerYieldClassIds: readonly string[];
  readonly callerYieldClassValues: readonly number[];
  readonly queryYieldClassId: string;
  readonly observedYieldClassValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedYieldClassValue: number;
  readonly signedObservedMinusYieldClassReference: number;
}>;
const inputFields = [
  {
    id: "callerYieldClassIds",
    label: "Caller yield class ids",
    kind: "stringList",
  },
  {
    id: "callerYieldClassValues",
    label: "Caller yield class values",
    kind: "numberList",
  },
  { id: "queryYieldClassId", label: "Query yield class id", kind: "string" },
  {
    id: "observedYieldClassValue",
    label: "Observed yield class value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerYieldClassIds,
    input.callerYieldClassValues,
    "callerYieldClassIds",
  );
  input.callerYieldClassValues.forEach((v) => nonnegative(v, "reference"));
  nonnegative(input.observedYieldClassValue, "observation");
  const i = catalogIndex(input.callerYieldClassIds, input.queryYieldClassId);
  return {
    callerMatchedYieldClassValue: input.callerYieldClassValues[i],
    signedObservedMinusYieldClassReference:
      input.observedYieldClassValue - input.callerYieldClassValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerYieldClassIds: ["a", "b"],
  callerYieldClassValues: [2, 4],
  queryYieldClassId: "b",
  observedYieldClassValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedYieldClassValue: 4,
  signedObservedMinusYieldClassReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/yield-class-lookup",
  title: "Yield Class Lookup",
  description:
    "Audit caller regional yield-class productivity reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedYieldClassValue",
      label: "Caller matched yield class value",
      kind: "number",
    },
    {
      id: "signedObservedMinusYieldClassReference",
      label: "Signed observed minus yield class reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerYieldClassIds: value.callerYieldClassIds as readonly string[],
      callerYieldClassValues: value.callerYieldClassValues as readonly number[],
      queryYieldClassId: value.queryYieldClassId as string,
      observedYieldClassValue: value.observedYieldClassValue as number,
    }),
});
export const run = tool.execute;
export default tool;
