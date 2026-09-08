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
  readonly callerVerifiedSmallCapsRelativeSizeKeys: readonly string[];
  readonly callerVerifiedSmallCapsRelativeSizeValues: readonly number[];
  readonly querySmallCapsRelativeSizeKey: string;
  readonly observedSmallCapsRelativeSizeValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedSmallCapsRelativeSizeKeys",
    label: "Caller verified small caps relative size keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSmallCapsRelativeSizeValues",
    label: "Caller verified small caps relative size values",
    kind: "numberList",
  },
  {
    id: "querySmallCapsRelativeSizeKey",
    label: "Query small caps relative size key",
    kind: "string",
  },
  {
    id: "observedSmallCapsRelativeSizeValue",
    label: "Observed small caps relative size value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    ...input.callerVerifiedSmallCapsRelativeSizeValues,
    input.observedSmallCapsRelativeSizeValue,
  ].forEach((v) => positive(v, "small-caps relative size"));
  aligned(
    input.callerVerifiedSmallCapsRelativeSizeKeys,
    input.callerVerifiedSmallCapsRelativeSizeValues,
    "callerVerifiedSmallCapsRelativeSizeKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedSmallCapsRelativeSizeKeys,
    input.querySmallCapsRelativeSizeKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedSmallCapsRelativeSizeValues[i],
    signedObservedMinusReference:
      input.observedSmallCapsRelativeSizeValue -
      input.callerVerifiedSmallCapsRelativeSizeValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSmallCapsRelativeSizeKeys: ["a", "b"],
  callerVerifiedSmallCapsRelativeSizeValues: [2, 4],
  querySmallCapsRelativeSizeKey: "b",
  observedSmallCapsRelativeSizeValue: 5,
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
  id: "typography/small-caps-size-percent",
  title: "Small Caps Size Percent Lookup",
  description:
    "Independently font/glyph/feature-specific actual small caps-to-cap height percent reference, not universal synthesized 0.8 em. Exact independently documented reference matching, signed discrepancy retained. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
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
      callerVerifiedSmallCapsRelativeSizeKeys:
        value.callerVerifiedSmallCapsRelativeSizeKeys as readonly string[],
      callerVerifiedSmallCapsRelativeSizeValues:
        value.callerVerifiedSmallCapsRelativeSizeValues as readonly number[],
      querySmallCapsRelativeSizeKey:
        value.querySmallCapsRelativeSizeKey as string,
      observedSmallCapsRelativeSizeValue:
        value.observedSmallCapsRelativeSizeValue as number,
    }),
});
export const run = tool.execute;
export default tool;
