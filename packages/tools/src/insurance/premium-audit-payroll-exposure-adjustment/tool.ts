import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  sumMoney,
  weightedMinor,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerPayrollClassIds: readonly string[];
  readonly observedEstimatedPayrollMinor: readonly number[];
  readonly observedAuditedPayrollMinor: readonly number[];
  readonly callerVerifiedPremiumMinorPer100CurrencyUnits: readonly number[];
  readonly callerMinimumAuditPremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly callerEstimatedClassPremiumMinor: readonly number[];
  readonly callerAuditedClassPremiumMinor: readonly number[];
  readonly callerEstimatedTotalPremiumMinor: number;
  readonly callerAuditedTotalPremiumMinor: number;
  readonly signedAuditPremiumAdjustmentMinor: number;
}>;
const inputFields = [
  {
    id: "callerPayrollClassIds",
    label: "Caller payroll class ids",
    kind: "stringList",
  },
  {
    id: "observedEstimatedPayrollMinor",
    label: "Observed estimated payroll minor",
    kind: "numberList",
  },
  {
    id: "observedAuditedPayrollMinor",
    label: "Observed audited payroll minor",
    kind: "numberList",
  },
  {
    id: "callerVerifiedPremiumMinorPer100CurrencyUnits",
    label: "Caller verified premium minor per100 currency units",
    kind: "numberList",
  },
  {
    id: "callerMinimumAuditPremiumMinor",
    label: "Caller minimum audit premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerPayrollClassIds, "classes");
  for (const values of [
    input.observedEstimatedPayrollMinor,
    input.observedAuditedPayrollMinor,
    input.callerVerifiedPremiumMinorPer100CurrencyUnits,
  ])
    aligned(input.callerPayrollClassIds, values, "classes");
  [
    ...input.observedEstimatedPayrollMinor,
    ...input.observedAuditedPayrollMinor,
    ...input.callerVerifiedPremiumMinorPer100CurrencyUnits,
    input.callerMinimumAuditPremiumMinor,
  ].forEach((v) => money(v));
  const estimated = input.observedEstimatedPayrollMinor.map((v, i) =>
      weightedMinor(
        v,
        input.callerVerifiedPremiumMinorPer100CurrencyUnits[i],
        10000,
      ),
    ),
    audited = input.observedAuditedPayrollMinor.map((v, i) =>
      weightedMinor(
        v,
        input.callerVerifiedPremiumMinorPer100CurrencyUnits[i],
        10000,
      ),
    ),
    e = Math.max(input.callerMinimumAuditPremiumMinor, sumMoney(estimated)),
    a = Math.max(input.callerMinimumAuditPremiumMinor, sumMoney(audited));
  return {
    callerEstimatedClassPremiumMinor: estimated,
    callerAuditedClassPremiumMinor: audited,
    callerEstimatedTotalPremiumMinor: e,
    callerAuditedTotalPremiumMinor: a,
    signedAuditPremiumAdjustmentMinor: a - e,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPayrollClassIds: ["a", "b"],
  observedEstimatedPayrollMinor: [100000, 200000],
  observedAuditedPayrollMinor: [120000, 150000],
  callerVerifiedPremiumMinorPer100CurrencyUnits: [200, 400],
  callerMinimumAuditPremiumMinor: 1000,
} satisfies Input;
export const exampleOutput = {
  callerEstimatedClassPremiumMinor: [2000, 8000],
  callerAuditedClassPremiumMinor: [2400, 6000],
  callerEstimatedTotalPremiumMinor: 10000,
  callerAuditedTotalPremiumMinor: 8400,
  signedAuditPremiumAdjustmentMinor: -1600,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/premium-audit-payroll-exposure-adjustment",
  title: "Premium Audit Payroll Exposure Adjustment Tool",
  description:
    "Audit actual estimated versus audited class payroll at independently verified rate per 100 currency units, exact class rounding and explicit minimum premium; not governing-class selection, payroll legality or insurer audit judgment.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerEstimatedClassPremiumMinor",
      label: "Caller estimated class premium minor",
      kind: "numberList",
    },
    {
      id: "callerAuditedClassPremiumMinor",
      label: "Caller audited class premium minor",
      kind: "numberList",
    },
    {
      id: "callerEstimatedTotalPremiumMinor",
      label: "Caller estimated total premium minor",
      kind: "number",
    },
    {
      id: "callerAuditedTotalPremiumMinor",
      label: "Caller audited total premium minor",
      kind: "number",
    },
    {
      id: "signedAuditPremiumAdjustmentMinor",
      label: "Signed audit premium adjustment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPayrollClassIds: value.callerPayrollClassIds as readonly string[],
      observedEstimatedPayrollMinor:
        value.observedEstimatedPayrollMinor as readonly number[],
      observedAuditedPayrollMinor:
        value.observedAuditedPayrollMinor as readonly number[],
      callerVerifiedPremiumMinorPer100CurrencyUnits:
        value.callerVerifiedPremiumMinorPer100CurrencyUnits as readonly number[],
      callerMinimumAuditPremiumMinor:
        value.callerMinimumAuditPremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
