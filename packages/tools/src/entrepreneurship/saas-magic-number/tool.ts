import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative, positive } from "../shared.js";

export type Input = Readonly<{
  readonly previousQuarterRevenue: number;
  readonly currentQuarterRevenue: number;
  readonly previousQuarterSalesMarketingSpend: number;
}>;
export type Output = Readonly<{
  readonly magicNumber: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.previousQuarterRevenue, "previousQuarterRevenue");
  nonnegative(input.currentQuarterRevenue, "currentQuarterRevenue");
  positive(
    input.previousQuarterSalesMarketingSpend,
    "previousQuarterSalesMarketingSpend",
  );
  return {
    magicNumber:
      (4 * (input.currentQuarterRevenue - input.previousQuarterRevenue)) /
      input.previousQuarterSalesMarketingSpend,
  };
};
export const exampleInput = {
  previousQuarterRevenue: 100,
  currentQuarterRevenue: 150,
  previousQuarterSalesMarketingSpend: 200,
} satisfies Input;
export const exampleOutput = { magicNumber: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/saas-magic-number",
  title: "SAAS Magic Number",
  description:
    "Calculate annualized quarterly revenue growth per prior-quarter sales and marketing spend.",
  inputs: [
    {
      id: "previousQuarterRevenue",
      label: "Previous quarter revenue",
      kind: "number",
    },
    {
      id: "currentQuarterRevenue",
      label: "Current quarter revenue",
      kind: "number",
    },
    {
      id: "previousQuarterSalesMarketingSpend",
      label: "Previous quarter sales marketing spend",
      kind: "number",
    },
  ],
  outputs: [{ id: "magicNumber", label: "Magic number", kind: "number" }],
  calculate: (value) =>
    calculate({
      previousQuarterRevenue: value.previousQuarterRevenue as number,
      currentQuarterRevenue: value.currentQuarterRevenue as number,
      previousQuarterSalesMarketingSpend:
        value.previousQuarterSalesMarketingSpend as number,
    }),
});
export const run = tool.execute;
export default tool;
