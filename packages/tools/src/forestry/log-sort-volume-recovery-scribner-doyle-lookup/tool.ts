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
  readonly callerScribnerDoyleRecoveryIds: readonly string[];
  readonly callerScribnerDoyleRecoveryValues: readonly number[];
  readonly queryScribnerDoyleRecoveryId: string;
  readonly observedScribnerDoyleRecoveryValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedScribnerDoyleRecoveryValue: number;
  readonly signedObservedMinusScribnerDoyleRecoveryReference: number;
}>;
const inputFields = [
  {
    id: "callerScribnerDoyleRecoveryIds",
    label: "Caller scribner doyle recovery ids",
    kind: "stringList",
  },
  {
    id: "callerScribnerDoyleRecoveryValues",
    label: "Caller scribner doyle recovery values",
    kind: "numberList",
  },
  {
    id: "queryScribnerDoyleRecoveryId",
    label: "Query scribner doyle recovery id",
    kind: "string",
  },
  {
    id: "observedScribnerDoyleRecoveryValue",
    label: "Observed scribner doyle recovery value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerScribnerDoyleRecoveryIds,
    input.callerScribnerDoyleRecoveryValues,
    "callerScribnerDoyleRecoveryIds",
  );
  input.callerScribnerDoyleRecoveryValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedScribnerDoyleRecoveryValue, "observation");
  const i = catalogIndex(
    input.callerScribnerDoyleRecoveryIds,
    input.queryScribnerDoyleRecoveryId,
  );
  return {
    callerMatchedScribnerDoyleRecoveryValue:
      input.callerScribnerDoyleRecoveryValues[i],
    signedObservedMinusScribnerDoyleRecoveryReference:
      input.observedScribnerDoyleRecoveryValue -
      input.callerScribnerDoyleRecoveryValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerScribnerDoyleRecoveryIds: ["a", "b"],
  callerScribnerDoyleRecoveryValues: [2, 4],
  queryScribnerDoyleRecoveryId: "b",
  observedScribnerDoyleRecoveryValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedScribnerDoyleRecoveryValue: 4,
  signedObservedMinusScribnerDoyleRecoveryReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/log-sort-volume-recovery-scribner-doyle-lookup",
  title: "Scribner/Doyle Log Scale Recovery Lookup",
  description:
    "Audit paired local Scribner/Doyle recovery scaling reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedScribnerDoyleRecoveryValue",
      label: "Caller matched scribner doyle recovery value",
      kind: "number",
    },
    {
      id: "signedObservedMinusScribnerDoyleRecoveryReference",
      label: "Signed observed minus scribner doyle recovery reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerScribnerDoyleRecoveryIds:
        value.callerScribnerDoyleRecoveryIds as readonly string[],
      callerScribnerDoyleRecoveryValues:
        value.callerScribnerDoyleRecoveryValues as readonly number[],
      queryScribnerDoyleRecoveryId:
        value.queryScribnerDoyleRecoveryId as string,
      observedScribnerDoyleRecoveryValue:
        value.observedScribnerDoyleRecoveryValue as number,
    }),
});
export const run = tool.execute;
export default tool;
