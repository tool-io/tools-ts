import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  bounded,
  aligned,
  unique,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly accountLabels: readonly string[];
  readonly signedSectionValuesMinor: readonly number[];
  readonly callerSectionCodes: readonly number[];
}>;
export type Output = Readonly<{
  readonly sectionTotalsCurrentAssetNoncurrentAssetCurrentLiabilityNoncurrentLiabilityEquityUnknownMinor: readonly number[];
  readonly unclassifiedAccountLabels: readonly string[];
}>;
const inputFields = [
  { id: "accountLabels", label: "Account labels", kind: "stringList" },
  {
    id: "signedSectionValuesMinor",
    label: "Signed section values minor",
    kind: "numberList",
  },
  {
    id: "callerSectionCodes",
    label: "Caller section codes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.signedSectionValuesMinor.forEach((v) =>
    integer(v, "signedSectionValuesMinor"),
  );
  aligned(input.accountLabels, input.signedSectionValuesMinor, "accountLabels");
  aligned(
    input.callerSectionCodes,
    input.signedSectionValuesMinor,
    "callerSectionCodes",
  );
  unique(input.accountLabels, "accounts");
  const totals = Array<number>(6).fill(0),
    unknown: string[] = [];
  input.callerSectionCodes.forEach((v, i) => {
    bounded(v, "section", 0, 5);
    totals[v] = integer(
      totals[v] + input.signedSectionValuesMinor[i],
      "sectionTotal",
    );
    if (v === 5) unknown.push(input.accountLabels[i]);
  });
  return {
    sectionTotalsCurrentAssetNoncurrentAssetCurrentLiabilityNoncurrentLiabilityEquityUnknownMinor:
      totals,
    unclassifiedAccountLabels: unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  accountLabels: ["Cash", "Plant", "Debt", "Mystery"],
  signedSectionValuesMinor: [100, 200, 50, 30],
  callerSectionCodes: [0, 1, 2, 5],
} satisfies Input;
export const exampleOutput = {
  sectionTotalsCurrentAssetNoncurrentAssetCurrentLiabilityNoncurrentLiabilityEquityUnknownMinor:
    [100, 200, 50, 0, 0, 30],
  unclassifiedAccountLabels: ["Mystery"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/classified-balance-sheet-section-sorter",
  title: "Classified Balance Sheet Section Sorter",
  description:
    "Sort observed account lines under explicit caller section annotations 0–4 and 5 unknown, preserving signed contra values and unclassified names; account names alone do not imply current/noncurrent recognition.",
  inputs: inputFields,
  outputs: [
    {
      id: "sectionTotalsCurrentAssetNoncurrentAssetCurrentLiabilityNoncurrentLiabilityEquityUnknownMinor",
      label:
        "Section totals current asset noncurrent asset current liability noncurrent liability equity unknown minor",
      kind: "numberList",
    },
    {
      id: "unclassifiedAccountLabels",
      label: "Unclassified account labels",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      accountLabels: value.accountLabels as readonly string[],
      signedSectionValuesMinor:
        value.signedSectionValuesMinor as readonly number[],
      callerSectionCodes: value.callerSectionCodes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
