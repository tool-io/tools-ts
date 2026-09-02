import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  aligned,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerMonthlyOldInterestMinor: readonly number[];
  readonly callerMonthlyTransferInterestMinor: readonly number[];
  readonly callerTransferUpfrontFeeMinor: number;
}>;
export type Output = Readonly<{
  readonly cumulativeSignedTransferSavingsMinor: readonly number[];
  readonly firstObservedBreakEvenMonth: number;
}>;
const inputFields = [
  {
    id: "callerMonthlyOldInterestMinor",
    label: "Caller monthly old interest minor",
    kind: "numberList",
  },
  {
    id: "callerMonthlyTransferInterestMinor",
    label: "Caller monthly transfer interest minor",
    kind: "numberList",
  },
  {
    id: "callerTransferUpfrontFeeMinor",
    label: "Caller transfer upfront fee minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerMonthlyOldInterestMinor,
    input.callerMonthlyTransferInterestMinor,
    "months",
  );
  money(input.callerTransferUpfrontFeeMinor);
  if (input.callerMonthlyOldInterestMinor.length > 600)
    simpleError("months", "At most600 caller monthly matched-balance charges.");
  let saved = -input.callerTransferUpfrontFeeMinor;
  const cumulative = input.callerMonthlyOldInterestMinor.map((v, i) => {
    money(v);
    money(input.callerMonthlyTransferInterestMinor[i]);
    saved = integer(
      saved + v - input.callerMonthlyTransferInterestMinor[i],
      "saved",
    );
    return saved;
  });
  return {
    cumulativeSignedTransferSavingsMinor: cumulative,
    firstObservedBreakEvenMonth: cumulative.findIndex((v) => v >= 0) + 1 || -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMonthlyOldInterestMinor: [100, 100, 100],
  callerMonthlyTransferInterestMinor: [50, 50, 50],
  callerTransferUpfrontFeeMinor: 100,
} satisfies Input;
export const exampleOutput = {
  cumulativeSignedTransferSavingsMinor: [-50, 0, 50],
  firstObservedBreakEvenMonth: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/balance-transfer-break-even-months",
  title: "Balance Transfer Break Even Months Calculator",
  description:
    "Route explicit matched-balance old/transfer monthly interest ledgers plus upfront fee to first break-even, reversals retained, no constantAPR approximation. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "cumulativeSignedTransferSavingsMinor",
      label: "Cumulative signed transfer savings minor",
      kind: "numberList",
    },
    {
      id: "firstObservedBreakEvenMonth",
      label: "First observed break even month",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMonthlyOldInterestMinor:
        value.callerMonthlyOldInterestMinor as readonly number[],
      callerMonthlyTransferInterestMinor:
        value.callerMonthlyTransferInterestMinor as readonly number[],
      callerTransferUpfrontFeeMinor:
        value.callerTransferUpfrontFeeMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
