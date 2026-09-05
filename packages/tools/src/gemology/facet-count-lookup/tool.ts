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
  readonly callerVerifiedFacetInventoryKeys: readonly string[];
  readonly callerVerifiedFacetInventoryValues: readonly number[];
  readonly queryFacetInventoryKey: string;
  readonly observedFacetInventoryValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedFacetInventoryKeys",
    label: "Caller verified facet inventory keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFacetInventoryValues",
    label: "Caller verified facet inventory values",
    kind: "numberList",
  },
  {
    id: "queryFacetInventoryKey",
    label: "Query facet inventory key",
    kind: "string",
  },
  {
    id: "observedFacetInventoryValue",
    label: "Observed facet inventory value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    ...input.callerVerifiedFacetInventoryValues,
    input.observedFacetInventoryValue,
  ].forEach((v) => {
    nonnegative(v, "facet count");
    integer(v, "facet count");
  });
  aligned(
    input.callerVerifiedFacetInventoryKeys,
    input.callerVerifiedFacetInventoryValues,
    "callerVerifiedFacetInventoryKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedFacetInventoryKeys,
    input.queryFacetInventoryKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedFacetInventoryValues[i],
    signedObservedMinusReference:
      input.observedFacetInventoryValue -
      input.callerVerifiedFacetInventoryValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFacetInventoryKeys: ["a", "b"],
  callerVerifiedFacetInventoryValues: [2, 4],
  queryFacetInventoryKey: "b",
  observedFacetInventoryValue: 5,
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
  id: "gemology/facet-count-lookup",
  title: "Facet Count by Cut Type Lookup",
  description:
    "Independently verified cut diagram/variant table/culet-inclusion convention actual facet count, not shape name universal count. Exact independently documented reference matching, signed discrepancy retained. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
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
      callerVerifiedFacetInventoryKeys:
        value.callerVerifiedFacetInventoryKeys as readonly string[],
      callerVerifiedFacetInventoryValues:
        value.callerVerifiedFacetInventoryValues as readonly number[],
      queryFacetInventoryKey: value.queryFacetInventoryKey as string,
      observedFacetInventoryValue: value.observedFacetInventoryValue as number,
    }),
});
export const run = tool.execute;
export default tool;
