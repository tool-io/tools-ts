import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  money,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly independentlyApplicableMarginalRatePercent: number;
  readonly actualTotalTaxMinor: number;
  readonly actualMatchedIncomeMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyApplicableMarginalRatePercent",
    label: "Independently applicable marginal rate percent",
    kind: "number",
  },
  {
    id: "actualTotalTaxMinor",
    label: "Actual total tax minor",
    kind: "number",
  },
  {
    id: "actualMatchedIncomeMinor",
    label: "Actual matched income minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!Number.isSafeInteger(input.actualTotalTaxMinor))
    simpleError("tax", "Signed safe-integer minor-unit net tax.");
  money(input.actualMatchedIncomeMinor, "income");
  positive(input.actualMatchedIncomeMinor, "income");
  nonnegative(input.independentlyApplicableMarginalRatePercent, "marginalrate");
  const e = (100 * input.actualTotalTaxMinor) / input.actualMatchedIncomeMinor;
  return {
    observedEffectiveRatePercent: e,
    signedMarginalEffectiveGapPercentagePoints:
      input.independentlyApplicableMarginalRatePercent - e,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyApplicableMarginalRatePercent: 30,
    actualTotalTaxMinor: 20000,
    actualMatchedIncomeMinor: 100000,
  },
  output: {
    result: {
      observedEffectiveRatePercent: 20,
      signedMarginalEffectiveGapPercentagePoints: 10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/marginal-vs-effective-rate-gap",
  title: "Marginal vs Effective Rate Gap Calculator",
  description:
    "Gap between independently applicable marginal rate and actual total-tax/matched-income effective rate. Same jurisdiction/period/income basis; permits signed net tax credits, not solve brackets, select tax base or forecast liability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
