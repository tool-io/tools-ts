import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  positive,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerCycleFixedAtmCostMinor: number;
  readonly netSurchargePerTransactionMinor: number;
}>;
export type Output = Readonly<{
  readonly minimumWholeTransactionsToBreakEven: number;
  readonly modeledNetCycleContributionAtBreakEvenMinor: number;
}>;
const inputFields = [
  {
    id: "callerCycleFixedAtmCostMinor",
    label: "Caller cycle fixed atm cost minor",
    kind: "number",
  },
  {
    id: "netSurchargePerTransactionMinor",
    label: "Net surcharge per transaction minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerCycleFixedAtmCostMinor, "callerCycleFixedAtmCostMinor");
  money(
    input.netSurchargePerTransactionMinor,
    "netSurchargePerTransactionMinor",
  );
  positive(input.netSurchargePerTransactionMinor, "netSurcharge");
  const n = integer(
    Number(
      (BigInt(input.callerCycleFixedAtmCostMinor) +
        BigInt(input.netSurchargePerTransactionMinor) -
        1n) /
        BigInt(input.netSurchargePerTransactionMinor),
    ),
    "transactions",
  );
  return {
    minimumWholeTransactionsToBreakEven: n,
    modeledNetCycleContributionAtBreakEvenMinor: integer(
      Number(
        BigInt(n) * BigInt(input.netSurchargePerTransactionMinor) -
          BigInt(input.callerCycleFixedAtmCostMinor),
      ),
      "contribution",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCycleFixedAtmCostMinor: 100,
  netSurchargePerTransactionMinor: 7,
} satisfies Input;
export const exampleOutput = {
  minimumWholeTransactionsToBreakEven: 15,
  modeledNetCycleContributionAtBreakEvenMinor: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/atm-surcharge-breakeven-transactions",
  title: "ATM Surcharge Breakeven Transactions Calculator",
  description:
    "Budget whole ATM surcharge transactions from caller cycle fixed cost and already net per-transaction contribution using exact ceiling division; transaction mix, customer fee effects and demand are not predicted.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumWholeTransactionsToBreakEven",
      label: "Minimum whole transactions to break even",
      kind: "number",
    },
    {
      id: "modeledNetCycleContributionAtBreakEvenMinor",
      label: "Modeled net cycle contribution at break even minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCycleFixedAtmCostMinor:
        value.callerCycleFixedAtmCostMinor as number,
      netSurchargePerTransactionMinor:
        value.netSurchargePerTransactionMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
