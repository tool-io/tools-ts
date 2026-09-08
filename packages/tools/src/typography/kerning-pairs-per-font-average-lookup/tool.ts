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
  readonly callerVerifiedFontKerningPairInventoryKeys: readonly string[];
  readonly callerVerifiedFontKerningPairInventoryValues: readonly number[];
  readonly queryFontKerningPairInventoryKey: string;
  readonly observedFontKerningPairInventoryValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedFontKerningPairInventoryKeys",
    label: "Caller verified font kerning pair inventory keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFontKerningPairInventoryValues",
    label: "Caller verified font kerning pair inventory values",
    kind: "numberList",
  },
  {
    id: "queryFontKerningPairInventoryKey",
    label: "Query font kerning pair inventory key",
    kind: "string",
  },
  {
    id: "observedFontKerningPairInventoryValue",
    label: "Observed font kerning pair inventory value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    ...input.callerVerifiedFontKerningPairInventoryValues,
    input.observedFontKerningPairInventoryValue,
  ].forEach((v) => {
    nonnegative(v, "declared kerning pair count");
    integer(v, "declared kerning pair count");
  });
  aligned(
    input.callerVerifiedFontKerningPairInventoryKeys,
    input.callerVerifiedFontKerningPairInventoryValues,
    "callerVerifiedFontKerningPairInventoryKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedFontKerningPairInventoryKeys,
    input.queryFontKerningPairInventoryKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedFontKerningPairInventoryValues[i],
    signedObservedMinusReference:
      input.observedFontKerningPairInventoryValue -
      input.callerVerifiedFontKerningPairInventoryValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFontKerningPairInventoryKeys: ["a", "b"],
  callerVerifiedFontKerningPairInventoryValues: [2, 4],
  queryFontKerningPairInventoryKey: "b",
  observedFontKerningPairInventoryValue: 5,
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
  id: "typography/kerning-pairs-per-font-average-lookup",
  title: "Average Kerning Pairs Per Font Lookup",
  description:
    "Independently font/version/shaping table-specific kerning pair inventory count, GPOS class kerning not naive pair count. Exact independently documented reference matching, signed discrepancy retained. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
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
      callerVerifiedFontKerningPairInventoryKeys:
        value.callerVerifiedFontKerningPairInventoryKeys as readonly string[],
      callerVerifiedFontKerningPairInventoryValues:
        value.callerVerifiedFontKerningPairInventoryValues as readonly number[],
      queryFontKerningPairInventoryKey:
        value.queryFontKerningPairInventoryKey as string,
      observedFontKerningPairInventoryValue:
        value.observedFontKerningPairInventoryValue as number,
    }),
});
export const run = tool.execute;
export default tool;
