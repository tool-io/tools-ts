import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedWinterWorkerLifespanMonthsKeys: readonly string[];
  readonly callerVerifiedWinterWorkerLifespanMonthsValues: readonly number[];
  readonly queryWinterWorkerLifespanMonthsKey: string;
  readonly observedWinterWorkerLifespanMonthsValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedWinterWorkerLifespanMonthsKeys",
    label: "Caller verified winter worker lifespan months keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedWinterWorkerLifespanMonthsValues",
    label: "Caller verified winter worker lifespan months values",
    kind: "numberList",
  },
  {
    id: "queryWinterWorkerLifespanMonthsKey",
    label: "Query winter worker lifespan months key",
    kind: "string",
  },
  {
    id: "observedWinterWorkerLifespanMonthsValue",
    label: "Observed winter worker lifespan months value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedWinterWorkerLifespanMonthsValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(
    input.observedWinterWorkerLifespanMonthsValue,
    "observed physical value",
  );
  aligned(
    input.callerVerifiedWinterWorkerLifespanMonthsKeys,
    input.callerVerifiedWinterWorkerLifespanMonthsValues,
    "callerVerifiedWinterWorkerLifespanMonthsKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedWinterWorkerLifespanMonthsKeys,
    input.queryWinterWorkerLifespanMonthsKey,
  );
  return {
    callerReferenceValue:
      input.callerVerifiedWinterWorkerLifespanMonthsValues[i],
    signedObservedMinusReference:
      input.observedWinterWorkerLifespanMonthsValue -
      input.callerVerifiedWinterWorkerLifespanMonthsValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedWinterWorkerLifespanMonthsKeys: ["a", "b"],
  callerVerifiedWinterWorkerLifespanMonthsValues: [2, 4],
  queryWinterWorkerLifespanMonthsKey: "b",
  observedWinterWorkerLifespanMonthsValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerReferenceValue: 4,
  signedObservedMinusReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/winter-bee-lifespan-months-lookup",
  title: "Winter Bee Lifespan Months Lookup",
  description:
    "Caller independently documented winter worker cohort/strain lifespan reference, no universal longevity. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerReferenceValue",
      label: "Caller reference value",
      kind: "number",
    },
    {
      id: "signedObservedMinusReference",
      label: "Signed observed minus reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedWinterWorkerLifespanMonthsKeys:
        value.callerVerifiedWinterWorkerLifespanMonthsKeys as readonly string[],
      callerVerifiedWinterWorkerLifespanMonthsValues:
        value.callerVerifiedWinterWorkerLifespanMonthsValues as readonly number[],
      queryWinterWorkerLifespanMonthsKey:
        value.queryWinterWorkerLifespanMonthsKey as string,
      observedWinterWorkerLifespanMonthsValue:
        value.observedWinterWorkerLifespanMonthsValue as number,
    }),
});
export const run = tool.execute;
export default tool;
