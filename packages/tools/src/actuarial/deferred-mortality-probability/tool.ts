import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, survival } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAnnualQx: readonly number[];
  readonly actualDeferralYears: number;
  readonly actualCoverageYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAnnualQx", label: "Actual annual qx", kind: "numberList" },
  { id: "actualDeferralYears", label: "Actual deferral years", kind: "number" },
  { id: "actualCoverageYears", label: "Actual coverage years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualCoverageYears,
    "coverage",
    1,
    input.actualAnnualQx.length,
  );
  return {
    deferredDeathProbability:
      survival(input.actualAnnualQx, 0, input.actualDeferralYears) *
      (1 -
        survival(
          input.actualAnnualQx,
          input.actualDeferralYears,
          input.actualDeferralYears + input.actualCoverageYears,
        )),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualAnnualQx: [0.1, 0.2, 0.5],
    actualDeferralYears: 1,
    actualCoverageYears: 2,
  },
  output: { result: { deferredDeathProbability: 0.5400000000000001 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/deferred-mortality-probability",
  title: "Deferred Mortality Probability Calculator",
  description:
    "Actualdeferreddeathsurvivefirstmthen dieinnconditionalannualtable,nopayoutdiscountor deferredtermEPV. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
