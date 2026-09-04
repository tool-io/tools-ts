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
  readonly callerMapleTapCountIds: readonly string[];
  readonly callerMapleTapCountValues: readonly number[];
  readonly queryMapleTapCountId: string;
  readonly observedMapleTapCountValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedMapleTapCountValue: number;
  readonly signedObservedMinusMapleTapCountReference: number;
}>;
const inputFields = [
  {
    id: "callerMapleTapCountIds",
    label: "Caller maple tap count ids",
    kind: "stringList",
  },
  {
    id: "callerMapleTapCountValues",
    label: "Caller maple tap count values",
    kind: "numberList",
  },
  {
    id: "queryMapleTapCountId",
    label: "Query maple tap count id",
    kind: "string",
  },
  {
    id: "observedMapleTapCountValue",
    label: "Observed maple tap count value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerMapleTapCountIds,
    input.callerMapleTapCountValues,
    "callerMapleTapCountIds",
  );
  input.callerMapleTapCountValues.forEach((v) => nonnegative(v, "reference"));
  nonnegative(input.observedMapleTapCountValue, "observation");
  const i = catalogIndex(
    input.callerMapleTapCountIds,
    input.queryMapleTapCountId,
  );
  return {
    callerMatchedMapleTapCountValue: input.callerMapleTapCountValues[i],
    signedObservedMinusMapleTapCountReference:
      input.observedMapleTapCountValue - input.callerMapleTapCountValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMapleTapCountIds: ["a", "b"],
  callerMapleTapCountValues: [2, 4],
  queryMapleTapCountId: "b",
  observedMapleTapCountValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedMapleTapCountValue: 4,
  signedObservedMinusMapleTapCountReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/maple-syrup-taps-per-tree-dbh-class-lookup",
  title: "Maple Taps Per Tree DBH Class Lookup",
  description:
    "Audit caller species/DBH/health-matched maple tap-count reference, no tapping prescription. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedMapleTapCountValue",
      label: "Caller matched maple tap count value",
      kind: "number",
    },
    {
      id: "signedObservedMinusMapleTapCountReference",
      label: "Signed observed minus maple tap count reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMapleTapCountIds: value.callerMapleTapCountIds as readonly string[],
      callerMapleTapCountValues:
        value.callerMapleTapCountValues as readonly number[],
      queryMapleTapCountId: value.queryMapleTapCountId as string,
      observedMapleTapCountValue: value.observedMapleTapCountValue as number,
    }),
});
export const run = tool.execute;
export default tool;
