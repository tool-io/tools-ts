import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
  integer,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFontLigatureInventoryKeys: readonly string[];
  readonly callerVerifiedFontLigatureInventoryValues: readonly number[];
  readonly queryFontLigatureInventoryKey: string;
  readonly observedFontLigatureInventoryValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedFontLigatureInventoryKeys",
    label: "Caller verified font ligature inventory keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFontLigatureInventoryValues",
    label: "Caller verified font ligature inventory values",
    kind: "numberList",
  },
  {
    id: "queryFontLigatureInventoryKey",
    label: "Query font ligature inventory key",
    kind: "string",
  },
  {
    id: "observedFontLigatureInventoryValue",
    label: "Observed font ligature inventory value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    ...input.callerVerifiedFontLigatureInventoryValues,
    input.observedFontLigatureInventoryValue,
  ].forEach((v) => {
    nonnegative(v, "declared ligature count");
    integer(v, "declared ligature count");
  });
  aligned(
    input.callerVerifiedFontLigatureInventoryKeys,
    input.callerVerifiedFontLigatureInventoryValues,
    "callerVerifiedFontLigatureInventoryKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedFontLigatureInventoryKeys,
    input.queryFontLigatureInventoryKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedFontLigatureInventoryValues[i],
    signedObservedMinusReference:
      input.observedFontLigatureInventoryValue -
      input.callerVerifiedFontLigatureInventoryValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFontLigatureInventoryKeys: ["a", "b"],
  callerVerifiedFontLigatureInventoryValues: [2, 4],
  queryFontLigatureInventoryKey: "b",
  observedFontLigatureInventoryValue: 5,
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
  id: "typography/ligature-count-common-fonts-lookup",
  title: "Common Font Ligature Count Lookup",
  description:
    "Independently font/version/feature-specific ligature inventory count, not assumed common font constant. Exact independently documented reference matching, signed discrepancy retained. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
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
      callerVerifiedFontLigatureInventoryKeys:
        value.callerVerifiedFontLigatureInventoryKeys as readonly string[],
      callerVerifiedFontLigatureInventoryValues:
        value.callerVerifiedFontLigatureInventoryValues as readonly number[],
      queryFontLigatureInventoryKey:
        value.queryFontLigatureInventoryKey as string,
      observedFontLigatureInventoryValue:
        value.observedFontLigatureInventoryValue as number,
    }),
});
export const run = tool.execute;
export default tool;
