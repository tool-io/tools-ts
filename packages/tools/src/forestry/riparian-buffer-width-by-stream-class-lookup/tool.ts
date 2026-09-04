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
  readonly callerRiparianBufferWidthIds: readonly string[];
  readonly callerRiparianBufferWidthValues: readonly number[];
  readonly queryRiparianBufferWidthId: string;
  readonly observedRiparianBufferWidthValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedRiparianBufferWidthValue: number;
  readonly signedObservedMinusRiparianBufferWidthReference: number;
}>;
const inputFields = [
  {
    id: "callerRiparianBufferWidthIds",
    label: "Caller riparian buffer width ids",
    kind: "stringList",
  },
  {
    id: "callerRiparianBufferWidthValues",
    label: "Caller riparian buffer width values",
    kind: "numberList",
  },
  {
    id: "queryRiparianBufferWidthId",
    label: "Query riparian buffer width id",
    kind: "string",
  },
  {
    id: "observedRiparianBufferWidthValue",
    label: "Observed riparian buffer width value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerRiparianBufferWidthIds,
    input.callerRiparianBufferWidthValues,
    "callerRiparianBufferWidthIds",
  );
  input.callerRiparianBufferWidthValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedRiparianBufferWidthValue, "observation");
  const i = catalogIndex(
    input.callerRiparianBufferWidthIds,
    input.queryRiparianBufferWidthId,
  );
  return {
    callerMatchedRiparianBufferWidthValue:
      input.callerRiparianBufferWidthValues[i],
    signedObservedMinusRiparianBufferWidthReference:
      input.observedRiparianBufferWidthValue -
      input.callerRiparianBufferWidthValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRiparianBufferWidthIds: ["a", "b"],
  callerRiparianBufferWidthValues: [2, 4],
  queryRiparianBufferWidthId: "b",
  observedRiparianBufferWidthValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedRiparianBufferWidthValue: 4,
  signedObservedMinusRiparianBufferWidthReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/riparian-buffer-width-by-stream-class-lookup",
  title: "Riparian Buffer Width By Stream Class Lookup",
  description:
    "Audit independently verified stream-class buffer width reference, no regulation assumed. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedRiparianBufferWidthValue",
      label: "Caller matched riparian buffer width value",
      kind: "number",
    },
    {
      id: "signedObservedMinusRiparianBufferWidthReference",
      label: "Signed observed minus riparian buffer width reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRiparianBufferWidthIds:
        value.callerRiparianBufferWidthIds as readonly string[],
      callerRiparianBufferWidthValues:
        value.callerRiparianBufferWidthValues as readonly number[],
      queryRiparianBufferWidthId: value.queryRiparianBufferWidthId as string,
      observedRiparianBufferWidthValue:
        value.observedRiparianBufferWidthValue as number,
    }),
});
export const run = tool.execute;
export default tool;
