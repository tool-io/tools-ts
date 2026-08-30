import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  bounded,
  weightedMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly fullYearChargeMinor: number;
  readonly callerConventionHalfYear: boolean;
  readonly callerActualMonthsInService: number;
}>;
export type Output = Readonly<{
  readonly callerProratedChargeMinor: number;
  readonly prorationNumeratorMonths: number;
  readonly prorationDenominatorMonths: number;
}>;
const inputFields = [
  {
    id: "fullYearChargeMinor",
    label: "Full year charge minor",
    kind: "number",
  },
  {
    id: "callerConventionHalfYear",
    label: "Caller convention half year",
    kind: "boolean",
  },
  {
    id: "callerActualMonthsInService",
    label: "Caller actual months in service",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.fullYearChargeMinor, "fullYearChargeMinor");
  bounded(input.callerActualMonthsInService, "months", 0, 12);
  const months = input.callerConventionHalfYear
    ? 6
    : input.callerActualMonthsInService;
  return {
    callerProratedChargeMinor: weightedMinor(
      input.fullYearChargeMinor,
      months,
      12,
    ),
    prorationNumeratorMonths: months,
    prorationDenominatorMonths: 12,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fullYearChargeMinor: 101,
  callerConventionHalfYear: true,
  callerActualMonthsInService: 3,
} satisfies Input;
export const exampleOutput = {
  callerProratedChargeMinor: 51,
  prorationNumeratorMonths: 6,
  prorationDenominatorMonths: 12,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/half-year-convention-partial-year-proration",
  title: "Half Year Convention Partial Year Proration Calculator",
  description:
    "Compare explicit half-year versus actual-whole-month caller book proration of a supplied annual charge, half-up to minor units; applicability, disposal convention and tax-year schedules are not determined.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerProratedChargeMinor",
      label: "Caller prorated charge minor",
      kind: "number",
    },
    {
      id: "prorationNumeratorMonths",
      label: "Proration numerator months",
      kind: "number",
    },
    {
      id: "prorationDenominatorMonths",
      label: "Proration denominator months",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fullYearChargeMinor: value.fullYearChargeMinor as number,
      callerConventionHalfYear: value.callerConventionHalfYear as boolean,
      callerActualMonthsInService: value.callerActualMonthsInService as number,
    }),
});
export const run = tool.execute;
export default tool;
