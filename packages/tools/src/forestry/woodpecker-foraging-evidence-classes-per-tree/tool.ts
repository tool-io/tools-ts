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
  readonly callerForagingEvidenceIds: readonly string[];
  readonly callerForagingEvidenceValues: readonly number[];
  readonly queryForagingEvidenceId: string;
  readonly observedForagingEvidenceValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedForagingEvidenceValue: number;
  readonly signedObservedMinusForagingEvidenceReference: number;
}>;
const inputFields = [
  {
    id: "callerForagingEvidenceIds",
    label: "Caller foraging evidence ids",
    kind: "stringList",
  },
  {
    id: "callerForagingEvidenceValues",
    label: "Caller foraging evidence values",
    kind: "numberList",
  },
  {
    id: "queryForagingEvidenceId",
    label: "Query foraging evidence id",
    kind: "string",
  },
  {
    id: "observedForagingEvidenceValue",
    label: "Observed foraging evidence value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerForagingEvidenceIds,
    input.callerForagingEvidenceValues,
    "callerForagingEvidenceIds",
  );
  input.callerForagingEvidenceValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedForagingEvidenceValue, "observation");
  const i = catalogIndex(
    input.callerForagingEvidenceIds,
    input.queryForagingEvidenceId,
  );
  return {
    callerMatchedForagingEvidenceValue: input.callerForagingEvidenceValues[i],
    signedObservedMinusForagingEvidenceReference:
      input.observedForagingEvidenceValue -
      input.callerForagingEvidenceValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerForagingEvidenceIds: ["a", "b"],
  callerForagingEvidenceValues: [2, 4],
  queryForagingEvidenceId: "b",
  observedForagingEvidenceValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedForagingEvidenceValue: 4,
  signedObservedMinusForagingEvidenceReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/woodpecker-foraging-evidence-classes-per-tree",
  title: "Woodpecker Foraging Evidence Classes Per Tree",
  description:
    "Audit caller independently verified woodpecker foraging evidence class reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedForagingEvidenceValue",
      label: "Caller matched foraging evidence value",
      kind: "number",
    },
    {
      id: "signedObservedMinusForagingEvidenceReference",
      label: "Signed observed minus foraging evidence reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerForagingEvidenceIds:
        value.callerForagingEvidenceIds as readonly string[],
      callerForagingEvidenceValues:
        value.callerForagingEvidenceValues as readonly number[],
      queryForagingEvidenceId: value.queryForagingEvidenceId as string,
      observedForagingEvidenceValue:
        value.observedForagingEvidenceValue as number,
    }),
});
export const run = tool.execute;
export default tool;
