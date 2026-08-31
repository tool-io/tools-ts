import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  literal,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedDailyClosingBalancesMinor: readonly number[];
  readonly callerWaiverBalanceThresholdMinor: number;
  readonly callerBalanceRule: string;
  readonly independentWaiverEvidenceSatisfied: boolean;
}>;
export type Output = Readonly<{
  readonly observedPolicyBalanceMinor: number;
  readonly balanceCriterionMet: boolean;
  readonly callerFeeWaiverQualified: boolean;
}>;
const inputFields = [
  {
    id: "observedDailyClosingBalancesMinor",
    label: "Observed daily closing balances minor",
    kind: "numberList",
  },
  {
    id: "callerWaiverBalanceThresholdMinor",
    label: "Caller waiver balance threshold minor",
    kind: "number",
  },
  { id: "callerBalanceRule", label: "Caller balance rule", kind: "string" },
  {
    id: "independentWaiverEvidenceSatisfied",
    label: "Independent waiver evidence satisfied",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.callerWaiverBalanceThresholdMinor,
    "callerWaiverBalanceThresholdMinor",
  );
  input.observedDailyClosingBalancesMinor.forEach((v) =>
    integer(v, "observedDailyClosingBalancesMinor"),
  );
  if (!input.observedDailyClosingBalancesMinor.length)
    simpleError(
      "balances",
      "Nonempty complete caller cycle daily-balance evidence required.",
    );
  literal(input.callerBalanceRule, ["average", "minimum"], "rule");
  const exactSum = input.observedDailyClosingBalancesMinor.reduce(
    (s, v) => s + BigInt(v),
    0n,
  );
  const metric =
      input.callerBalanceRule === "minimum"
        ? Math.min(...input.observedDailyClosingBalancesMinor)
        : Number(exactSum) / input.observedDailyClosingBalancesMinor.length,
    met =
      input.callerBalanceRule === "minimum"
        ? metric >= input.callerWaiverBalanceThresholdMinor
        : exactSum >=
          BigInt(input.callerWaiverBalanceThresholdMinor) *
            BigInt(input.observedDailyClosingBalancesMinor.length);
  return {
    observedPolicyBalanceMinor: metric,
    balanceCriterionMet: met,
    callerFeeWaiverQualified: met || input.independentWaiverEvidenceSatisfied,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDailyClosingBalancesMinor: [100, 300],
  callerWaiverBalanceThresholdMinor: 150,
  callerBalanceRule: "average",
  independentWaiverEvidenceSatisfied: false,
} satisfies Input;
export const exampleOutput = {
  observedPolicyBalanceMinor: 200,
  balanceCriterionMet: true,
  callerFeeWaiverQualified: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/minimum-balance-waiver-checker",
  title: "Minimum Balance Waiver Checker",
  description:
    "Audit actual cycle daily closing balances under caller minimum/average waiver rule with independent alternate qualification evidence; cycle completeness, collected-versus-ledger balance definitions and account terms are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPolicyBalanceMinor",
      label: "Observed policy balance minor",
      kind: "number",
    },
    {
      id: "balanceCriterionMet",
      label: "Balance criterion met",
      kind: "boolean",
    },
    {
      id: "callerFeeWaiverQualified",
      label: "Caller fee waiver qualified",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDailyClosingBalancesMinor:
        value.observedDailyClosingBalancesMinor as readonly number[],
      callerWaiverBalanceThresholdMinor:
        value.callerWaiverBalanceThresholdMinor as number,
      callerBalanceRule: value.callerBalanceRule as string,
      independentWaiverEvidenceSatisfied:
        value.independentWaiverEvidenceSatisfied as boolean,
    }),
});
export const run = tool.execute;
export default tool;
