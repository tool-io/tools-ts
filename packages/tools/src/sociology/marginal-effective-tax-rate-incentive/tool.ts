import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, money } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly beforeGrossEarningsMinor: number;
  readonly afterGrossEarningsMinor: number;
  readonly beforeNetDisposableMinor: number;
  readonly afterNetDisposableMinor: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "beforeGrossEarningsMinor",
    label: "Before gross earnings minor",
    kind: "number",
  },
  {
    id: "afterGrossEarningsMinor",
    label: "After gross earnings minor",
    kind: "number",
  },
  {
    id: "beforeNetDisposableMinor",
    label: "Before net disposable minor",
    kind: "number",
  },
  {
    id: "afterNetDisposableMinor",
    label: "After net disposable minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  [
    input.beforeGrossEarningsMinor,
    input.afterGrossEarningsMinor,
    input.beforeNetDisposableMinor,
    input.afterNetDisposableMinor,
  ].forEach((v) => money(v, "income"));
  positive(
    input.afterGrossEarningsMinor - input.beforeGrossEarningsMinor,
    "earningsincrease",
  );
  return {
    conditionalMarginalEffectiveTaxPercent:
      100 *
      (1 -
        (input.afterNetDisposableMinor - input.beforeNetDisposableMinor) /
          (input.afterGrossEarningsMinor - input.beforeGrossEarningsMinor)),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    beforeGrossEarningsMinor: 1000,
    afterGrossEarningsMinor: 1200,
    beforeNetDisposableMinor: 800,
    afterNetDisposableMinor: 900,
  },
  output: { result: { conditionalMarginalEffectiveTaxPercent: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/marginal-effective-tax-rate-incentive",
  title: "Marginal Effective Tax Rate Work Incentive Calculator",
  description:
    "Finite matched tax-benefit scenario METRfrom actual disposable-income change versus positive gross-earnings change; signed negative and above100results retained. Not a tax-bracket derivative or causal work response.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalMarginalEffectiveTaxPercent: { type: "number" },
        },
        required: ["conditionalMarginalEffectiveTaxPercent"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
