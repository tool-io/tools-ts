import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly monthlyLivingExpenses: number;
  readonly monthlyPersonalIncome: number;
  readonly personalCashReserve: number;
}>;
export type Output = Readonly<{
  readonly monthlyGap: number;
  readonly personalRunwayMonths: number;
  readonly ramenProfitable: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.monthlyLivingExpenses <= 0 ||
    input.monthlyPersonalIncome < 0 ||
    input.personalCashReserve < 0
  )
    simpleError(
      "monthlyLivingExpenses",
      "Positive living costs and nonnegative income and cash reserve required.",
    );
  const monthlyGap = Math.max(
    0,
    input.monthlyLivingExpenses - input.monthlyPersonalIncome,
  );
  return {
    monthlyGap,
    personalRunwayMonths:
      monthlyGap === 0 ? 0 : input.personalCashReserve / monthlyGap,
    ramenProfitable: monthlyGap === 0,
  };
};
export const exampleInput = {
  monthlyLivingExpenses: 3000,
  monthlyPersonalIncome: 2500,
  personalCashReserve: 1000,
} satisfies Input;
export const exampleOutput = {
  monthlyGap: 500,
  personalRunwayMonths: 2,
  ramenProfitable: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/ramen-profitability-gap",
  title: "Ramen Profitability Gap",
  description:
    "Compare founder personal income with living costs and compute cash runway if short.",
  inputs: [
    {
      id: "monthlyLivingExpenses",
      label: "Monthly living expenses",
      kind: "number",
    },
    {
      id: "monthlyPersonalIncome",
      label: "Monthly personal income",
      kind: "number",
    },
    {
      id: "personalCashReserve",
      label: "Personal cash reserve",
      kind: "number",
    },
  ],
  outputs: [
    { id: "monthlyGap", label: "Monthly gap", kind: "number" },
    {
      id: "personalRunwayMonths",
      label: "Personal runway months",
      kind: "number",
      description:
        "Cash-reserve runway during a monthly shortfall; zero when income already covers living expenses.",
    },
    { id: "ramenProfitable", label: "Ramen profitable", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      monthlyLivingExpenses: value.monthlyLivingExpenses as number,
      monthlyPersonalIncome: value.monthlyPersonalIncome as number,
      personalCashReserve: value.personalCashReserve as number,
    }),
});
export const run = tool.execute;
export default tool;
