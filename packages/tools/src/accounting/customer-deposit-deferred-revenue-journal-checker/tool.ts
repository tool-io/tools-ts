import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, money, integer } from "../batch-shared.js";
export type Input = Readonly<{
  readonly customerCashDepositMinor: number;
  readonly callerEarnedPerformanceMinor: number;
  readonly previouslyRecognizedDepositRevenueMinor: number;
}>;
export type Output = Readonly<{
  readonly requiredRemainingDeferredRevenueMinor: number;
  readonly signedIncrementalRevenueRecognitionMinor: number;
}>;
const inputFields = [
  {
    id: "customerCashDepositMinor",
    label: "Customer cash deposit minor",
    kind: "number",
  },
  {
    id: "callerEarnedPerformanceMinor",
    label: "Caller earned performance minor",
    kind: "number",
  },
  {
    id: "previouslyRecognizedDepositRevenueMinor",
    label: "Previously recognized deposit revenue minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.customerCashDepositMinor, "customerCashDepositMinor");
  money(input.callerEarnedPerformanceMinor, "callerEarnedPerformanceMinor");
  money(
    input.previouslyRecognizedDepositRevenueMinor,
    "previouslyRecognizedDepositRevenueMinor",
  );
  if (
    input.callerEarnedPerformanceMinor > input.customerCashDepositMinor ||
    input.previouslyRecognizedDepositRevenueMinor >
      input.customerCashDepositMinor
  )
    simpleError(
      "deposit",
      "This deposit-only model cannot recognize more than the deposit; other receivables are separate.",
    );
  return {
    requiredRemainingDeferredRevenueMinor:
      input.customerCashDepositMinor - input.callerEarnedPerformanceMinor,
    signedIncrementalRevenueRecognitionMinor: integer(
      input.callerEarnedPerformanceMinor -
        input.previouslyRecognizedDepositRevenueMinor,
      "trueUp",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  customerCashDepositMinor: 100,
  callerEarnedPerformanceMinor: 30,
  previouslyRecognizedDepositRevenueMinor: 10,
} satisfies Input;
export const exampleOutput = {
  requiredRemainingDeferredRevenueMinor: 70,
  signedIncrementalRevenueRecognitionMinor: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/customer-deposit-deferred-revenue-journal-checker",
  title: "Customer Deposit Deferred Revenue Journal Checker",
  description:
    "Audit deposit-only deferred revenue against caller earned performance and previous recognition, retaining signed true-ups; cash receipt alone is not revenue and earned-performance support is external.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredRemainingDeferredRevenueMinor",
      label: "Required remaining deferred revenue minor",
      kind: "number",
    },
    {
      id: "signedIncrementalRevenueRecognitionMinor",
      label: "Signed incremental revenue recognition minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      customerCashDepositMinor: value.customerCashDepositMinor as number,
      callerEarnedPerformanceMinor:
        value.callerEarnedPerformanceMinor as number,
      previouslyRecognizedDepositRevenueMinor:
        value.previouslyRecognizedDepositRevenueMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
