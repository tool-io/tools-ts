import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly vendorNames: readonly string[];
  readonly paymentAmounts: readonly number[];
  readonly amountTolerance: number;
}>;
export type Output = Readonly<{
  readonly candidatePairs: readonly string[];
  readonly candidateCount: number;
  readonly candidatePaymentValue: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.vendorNames.length;
  if (
    n === 0 ||
    input.paymentAmounts.length !== n ||
    input.paymentAmounts.some((value) => value < 0)
  )
    simpleError(
      "vendorNames",
      "Aligned vendor names and nonnegative payments are required.",
      "invalid_payments",
    );
  const normalized = input.vendorNames.map((value) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, ""),
  );
  const candidatePairs: string[] = [];
  let candidatePaymentValue = 0;
  for (let i = 0; i < n; i += 1)
    for (let j = i + 1; j < n; j += 1)
      if (
        normalized[i] === normalized[j] &&
        Math.abs(input.paymentAmounts[i] - input.paymentAmounts[j]) <=
          input.amountTolerance
      ) {
        candidatePairs.push(`${i}-${j}`);
        candidatePaymentValue += input.paymentAmounts[j];
      }
  return {
    candidatePairs,
    candidateCount: candidatePairs.length,
    candidatePaymentValue,
  };
};

export const exampleInput = {
  vendorNames: ["Acme Inc.", "ACME INC", "Beta"],
  paymentAmounts: [100, 101, 50],
  amountTolerance: 2,
} satisfies Input;
export const exampleOutput = {
  candidatePairs: ["0-1"],
  candidateCount: 1,
  candidatePaymentValue: 101,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      vendorNames: input.vendorNames as readonly string[],
      paymentAmounts: input.paymentAmounts as readonly number[],
      amountTolerance: input.amountTolerance as number,
    }),
  description:
    "Find duplicate vendor-payment candidates by normalized name and amount tolerance.",
  id: "auditing/duplicate-vendor-payment",
  inputs: [
    { id: "vendorNames", label: "Vendor names", kind: "stringList" },
    { id: "paymentAmounts", label: "Payment amounts", kind: "numberList" },
    {
      id: "amountTolerance",
      label: "Payment amount tolerance",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "candidatePairs",
      label: "Candidate duplicate index pairs",
      kind: "stringList",
    },
    {
      id: "candidateCount",
      label: "Candidate duplicate count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "candidatePaymentValue",
      label: "Later-payment value in candidate pairs",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Duplicate Vendor Payment",
});

export const run = tool.execute;
export default tool;
