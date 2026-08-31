import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  aligned,
  unique,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly issuedCheckIds: readonly string[];
  readonly issuedAmountsMinor: readonly number[];
  readonly issuedPayeeLabels: readonly string[];
  readonly presentedCheckIds: readonly string[];
  readonly presentedAmountsMinor: readonly number[];
  readonly presentedPayeeLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly presentedIssueMatchIndices: readonly number[];
  readonly amountMismatchPresentedIndices: readonly number[];
  readonly payeeMismatchPresentedIndices: readonly number[];
  readonly unissuedPresentedIndices: readonly number[];
  readonly allPresentedRecordsMatch: boolean;
}>;
const inputFields = [
  { id: "issuedCheckIds", label: "Issued check ids", kind: "stringList" },
  {
    id: "issuedAmountsMinor",
    label: "Issued amounts minor",
    kind: "numberList",
  },
  { id: "issuedPayeeLabels", label: "Issued payee labels", kind: "stringList" },
  { id: "presentedCheckIds", label: "Presented check ids", kind: "stringList" },
  {
    id: "presentedAmountsMinor",
    label: "Presented amounts minor",
    kind: "numberList",
  },
  {
    id: "presentedPayeeLabels",
    label: "Presented payee labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.issuedAmountsMinor.forEach((v) => money(v, "issuedAmountsMinor"));
  input.presentedAmountsMinor.forEach((v) => money(v, "presentedAmountsMinor"));
  aligned(input.issuedCheckIds, input.issuedAmountsMinor, "issuedCheckIds");
  aligned(input.issuedCheckIds, input.issuedPayeeLabels, "issuedCheckIds");
  aligned(
    input.presentedCheckIds,
    input.presentedAmountsMinor,
    "presentedCheckIds",
  );
  aligned(
    input.presentedCheckIds,
    input.presentedPayeeLabels,
    "presentedCheckIds",
  );
  unique(input.issuedCheckIds, "issued");
  unique(input.presentedCheckIds, "presented");
  const matches = input.presentedCheckIds.map((s) =>
      input.issuedCheckIds.indexOf(s),
    ),
    amount: number[] = [],
    payee: number[] = [],
    missing: number[] = [];
  matches.forEach((j, i) => {
    if (j < 0) missing.push(i);
    else {
      if (input.presentedAmountsMinor[i] !== input.issuedAmountsMinor[j])
        amount.push(i);
      if (input.presentedPayeeLabels[i] !== input.issuedPayeeLabels[j])
        payee.push(i);
    }
  });
  return {
    presentedIssueMatchIndices: matches,
    amountMismatchPresentedIndices: amount,
    payeeMismatchPresentedIndices: payee,
    unissuedPresentedIndices: missing,
    allPresentedRecordsMatch:
      amount.length + payee.length + missing.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  issuedCheckIds: ["001", "002"],
  issuedAmountsMinor: [100, 200],
  issuedPayeeLabels: ["Alpha", "Beta"],
  presentedCheckIds: ["001", "003"],
  presentedAmountsMinor: [110, 200],
  presentedPayeeLabels: ["Alpha", "Gamma"],
} satisfies Input;
export const exampleOutput = {
  presentedIssueMatchIndices: [0, -1],
  amountMismatchPresentedIndices: [0],
  payeeMismatchPresentedIndices: [],
  unissuedPresentedIndices: [1],
  allPresentedRecordsMatch: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/positive-pay-issue-mismatch-checker",
  title: "Positive Pay Issue Mismatch Checker",
  description:
    "Match presented checks to actual issue ledger with exact ID/amount/payee comparisons and separate mismatch witnesses; no fuzzy payee normalization, duplicate-presentment authorization, check authenticity or fraud conclusion.",
  inputs: inputFields,
  outputs: [
    {
      id: "presentedIssueMatchIndices",
      label: "Presented issue match indices",
      kind: "numberList",
    },
    {
      id: "amountMismatchPresentedIndices",
      label: "Amount mismatch presented indices",
      kind: "numberList",
    },
    {
      id: "payeeMismatchPresentedIndices",
      label: "Payee mismatch presented indices",
      kind: "numberList",
    },
    {
      id: "unissuedPresentedIndices",
      label: "Unissued presented indices",
      kind: "numberList",
    },
    {
      id: "allPresentedRecordsMatch",
      label: "All presented records match",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      issuedCheckIds: value.issuedCheckIds as readonly string[],
      issuedAmountsMinor: value.issuedAmountsMinor as readonly number[],
      issuedPayeeLabels: value.issuedPayeeLabels as readonly string[],
      presentedCheckIds: value.presentedCheckIds as readonly string[],
      presentedAmountsMinor: value.presentedAmountsMinor as readonly number[],
      presentedPayeeLabels: value.presentedPayeeLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
