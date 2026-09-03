import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedDesignFreezingIndexKeys: readonly string[];
  readonly callerVerifiedDesignFreezingIndexValues: readonly number[];
  readonly queryDesignFreezingIndexKey: string;
  readonly observedDesignFreezingIndexValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedDesignFreezingIndexKeys",
    label: "Caller verified design freezing index keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedDesignFreezingIndexValues",
    label: "Caller verified design freezing index values",
    kind: "numberList",
  },
  {
    id: "queryDesignFreezingIndexKey",
    label: "Query design freezing index key",
    kind: "string",
  },
  {
    id: "observedDesignFreezingIndexValue",
    label: "Observed design freezing index value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    ...input.callerVerifiedDesignFreezingIndexValues,
    input.observedDesignFreezingIndexValue,
  ].forEach((v) => nonnegative(v, "freezing index"));
  aligned(
    input.callerVerifiedDesignFreezingIndexKeys,
    input.callerVerifiedDesignFreezingIndexValues,
    "callerVerifiedDesignFreezingIndexKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedDesignFreezingIndexKeys,
    input.queryDesignFreezingIndexKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedDesignFreezingIndexValues[i],
    signedObservedMinusReference:
      input.observedDesignFreezingIndexValue -
      input.callerVerifiedDesignFreezingIndexValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedDesignFreezingIndexKeys: ["a", "b"],
  callerVerifiedDesignFreezingIndexValues: [2, 4],
  queryDesignFreezingIndexKey: "b",
  observedDesignFreezingIndexValue: 5,
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
  id: "climatology/design-freezing-index-lookup",
  title: "Design Freezing Index Selection Lookup",
  description:
    "Independently verified site/baseline/return period design freezing index reference, not fixed regional building code or current soil state. Exact independently documented reference matching, signed discrepancy retained. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
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
      callerVerifiedDesignFreezingIndexKeys:
        value.callerVerifiedDesignFreezingIndexKeys as readonly string[],
      callerVerifiedDesignFreezingIndexValues:
        value.callerVerifiedDesignFreezingIndexValues as readonly number[],
      queryDesignFreezingIndexKey: value.queryDesignFreezingIndexKey as string,
      observedDesignFreezingIndexValue:
        value.observedDesignFreezingIndexValue as number,
    }),
});
export const run = tool.execute;
export default tool;
