import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
  positive,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedMainSequenceMassKeys: readonly string[];
  readonly callerVerifiedMainSequenceMassValues: readonly number[];
  readonly queryMainSequenceMassKey: string;
  readonly observedMainSequenceMassValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedMainSequenceMassKeys",
    label: "Caller verified main sequence mass keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMainSequenceMassValues",
    label: "Caller verified main sequence mass values",
    kind: "numberList",
  },
  {
    id: "queryMainSequenceMassKey",
    label: "Query main sequence mass key",
    kind: "string",
  },
  {
    id: "observedMainSequenceMassValue",
    label: "Observed main sequence mass value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    ...input.callerVerifiedMainSequenceMassValues,
    input.observedMainSequenceMassValue,
  ].forEach((v) => positive(v, "stellar mass"));
  aligned(
    input.callerVerifiedMainSequenceMassKeys,
    input.callerVerifiedMainSequenceMassValues,
    "callerVerifiedMainSequenceMassKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedMainSequenceMassKeys,
    input.queryMainSequenceMassKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedMainSequenceMassValues[i],
    signedObservedMinusReference:
      input.observedMainSequenceMassValue -
      input.callerVerifiedMainSequenceMassValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedMainSequenceMassKeys: ["a", "b"],
  callerVerifiedMainSequenceMassValues: [2, 4],
  queryMainSequenceMassKey: "b",
  observedMainSequenceMassValue: 5,
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
  id: "astronomy/stellar-mass-from-type-main-sequence",
  title: "Main Sequence Mass By Type Lookup",
  description:
    "Independently documented main-sequence spectral-subclass mass reference, metallicity/evolution spread not eliminated. Exact independently documented reference matching, signed discrepancy retained. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedMainSequenceMassKeys:
        value.callerVerifiedMainSequenceMassKeys as readonly string[],
      callerVerifiedMainSequenceMassValues:
        value.callerVerifiedMainSequenceMassValues as readonly number[],
      queryMainSequenceMassKey: value.queryMainSequenceMassKey as string,
      observedMainSequenceMassValue:
        value.observedMainSequenceMassValue as number,
    }),
});
export const run = tool.execute;
export default tool;
