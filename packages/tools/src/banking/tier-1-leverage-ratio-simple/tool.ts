import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  sumMoney,
  roundMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTierOneCapitalComponentsMinor: readonly number[];
  readonly callerTierOneDeductionsMinor: readonly number[];
  readonly observedExposureBalancesMinor: readonly number[];
  readonly observedExposurePeriodDays: readonly number[];
  readonly callerExposureAdjustmentMinor: number;
}>;
export type Output = Readonly<{
  readonly callerNetTierOneMinor: number;
  readonly dayWeightedAdjustedExposureMinor: number;
  readonly callerTierOneLeverageRatio: number;
}>;
const inputFields = [
  {
    id: "observedTierOneCapitalComponentsMinor",
    label: "Observed tier one capital components minor",
    kind: "numberList",
  },
  {
    id: "callerTierOneDeductionsMinor",
    label: "Caller tier one deductions minor",
    kind: "numberList",
  },
  {
    id: "observedExposureBalancesMinor",
    label: "Observed exposure balances minor",
    kind: "numberList",
  },
  {
    id: "observedExposurePeriodDays",
    label: "Observed exposure period days",
    kind: "numberList",
  },
  {
    id: "callerExposureAdjustmentMinor",
    label: "Caller exposure adjustment minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  for (const v of [
    input.observedTierOneCapitalComponentsMinor,
    input.callerTierOneDeductionsMinor,
    input.observedExposureBalancesMinor,
  ])
    v.forEach((x) => money(x));
  money(input.callerExposureAdjustmentMinor);
  aligned(
    input.observedExposureBalancesMinor,
    input.observedExposurePeriodDays,
    "exposure",
  );
  input.observedExposurePeriodDays.forEach((v) => bounded(v, "days", 1, 36600));
  const capital =
      sumMoney(input.observedTierOneCapitalComponentsMinor) -
      sumMoney(input.callerTierOneDeductionsMinor),
    days = sumMoney(input.observedExposurePeriodDays),
    exposure = sumMoney([
      roundMinor(
        input.observedExposureBalancesMinor.reduce(
          (s, v, i) =>
            s + BigInt(v) * BigInt(input.observedExposurePeriodDays[i]),
          0n,
        ),
        BigInt(days),
      ),
      input.callerExposureAdjustmentMinor,
    ]);
  positive(exposure, "adjusted exposure");
  return {
    callerNetTierOneMinor: capital,
    dayWeightedAdjustedExposureMinor: exposure,
    callerTierOneLeverageRatio: capital / exposure,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTierOneCapitalComponentsMinor: [200, 50],
  callerTierOneDeductionsMinor: [20],
  observedExposureBalancesMinor: [1000, 2000],
  observedExposurePeriodDays: [1, 3],
  callerExposureAdjustmentMinor: 50,
} satisfies Input;
export const exampleOutput = {
  callerNetTierOneMinor: 230,
  dayWeightedAdjustedExposureMinor: 1800,
  callerTierOneLeverageRatio: 0.12777777777777777,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/tier-1-leverage-ratio-simple",
  title: "Tier 1 Leverage Ratio Simple Calculator",
  description:
    "Audit explicit Tier1 capital/deductions and day-weighted leverage exposure adjustment ledgers, signed overdeduction retained; not Tier1/risk-weighted-asset ratio. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerNetTierOneMinor",
      label: "Caller net tier one minor",
      kind: "number",
    },
    {
      id: "dayWeightedAdjustedExposureMinor",
      label: "Day weighted adjusted exposure minor",
      kind: "number",
    },
    {
      id: "callerTierOneLeverageRatio",
      label: "Caller tier one leverage ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTierOneCapitalComponentsMinor:
        value.observedTierOneCapitalComponentsMinor as readonly number[],
      callerTierOneDeductionsMinor:
        value.callerTierOneDeductionsMinor as readonly number[],
      observedExposureBalancesMinor:
        value.observedExposureBalancesMinor as readonly number[],
      observedExposurePeriodDays:
        value.observedExposurePeriodDays as readonly number[],
      callerExposureAdjustmentMinor:
        value.callerExposureAdjustmentMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
