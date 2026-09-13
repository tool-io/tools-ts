import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, npvScope } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRentNetCashFlowsByPeriod: readonly number[];
  readonly actualBuyNetCashFlowsByPeriod: readonly number[];
  readonly callerApplicableDiscountRate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRentNetCashFlowsByPeriod",
    label: "Actual rent net cash flows by period",
    kind: "numberList",
  },
  {
    id: "actualBuyNetCashFlowsByPeriod",
    label: "Actual buy net cash flows by period",
    kind: "numberList",
  },
  {
    id: "callerApplicableDiscountRate",
    label: "Caller applicable discount rate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualRentNetCashFlowsByPeriod,
    input.actualBuyNetCashFlowsByPeriod,
    "periods",
  );
  const a = npvScope(
      input.actualRentNetCashFlowsByPeriod,
      input.callerApplicableDiscountRate,
    ),
    b = npvScope(
      input.actualBuyNetCashFlowsByPeriod,
      input.callerApplicableDiscountRate,
    );
  return {
    rentScenarioNpv: a,
    buyScenarioNpv: b,
    signedBuyMinusRentNpv: b - a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRentNetCashFlowsByPeriod: [-10, -10],
    actualBuyNetCashFlowsByPeriod: [-20, 5],
    callerApplicableDiscountRate: 0,
  },
  output: {
    result: {
      rentScenarioNpv: -20,
      buyScenarioNpv: -15,
      signedBuyMinusRentNpv: 5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/rent-vs-buy-npv",
  title: "Rent vs Buy NPV Calculator",
  description:
    "Compare actual separately qualified rent scenario and buyscenariocashflowNPV, p0initial, timing/currency/rate independent. Not invent cash flows, owner gains, tax/maintenance/appreciation or choose housing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
