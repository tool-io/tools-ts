import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly recoveredRevenuePerOreTonne: number;
  readonly oreMiningCostPerTonne: number;
  readonly processingCostPerOreTonne: number;
  readonly wasteCostPerTonne: number;
}>;
export type Output = Readonly<{
  readonly breakevenWasteOreMassRatio: number;
  readonly preStrippingMarginPerOreTonne: number;
  readonly economicPositiveMargin: boolean;
}>;
const inputFields = [
  {
    id: "recoveredRevenuePerOreTonne",
    label: "Recovered revenue per ore tonne",
    kind: "number",
  },
  {
    id: "oreMiningCostPerTonne",
    label: "Ore mining cost per tonne",
    kind: "number",
  },
  {
    id: "processingCostPerOreTonne",
    label: "Processing cost per ore tonne",
    kind: "number",
  },
  { id: "wasteCostPerTonne", label: "Waste cost per tonne", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.wasteCostPerTonne, "wasteCostPerTonne");
  nonnegative(input.recoveredRevenuePerOreTonne, "recoveredRevenuePerOreTonne");
  nonnegative(input.oreMiningCostPerTonne, "oreMiningCostPerTonne");
  nonnegative(input.processingCostPerOreTonne, "processingCostPerOreTonne");
  const preStrippingMarginPerOreTonne =
    input.recoveredRevenuePerOreTonne -
    input.oreMiningCostPerTonne -
    input.processingCostPerOreTonne;
  return {
    breakevenWasteOreMassRatio:
      preStrippingMarginPerOreTonne / input.wasteCostPerTonne,
    preStrippingMarginPerOreTonne,
    economicPositiveMargin: preStrippingMarginPerOreTonne > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recoveredRevenuePerOreTonne: 100,
  oreMiningCostPerTonne: 20,
  processingCostPerOreTonne: 30,
  wasteCostPerTonne: 10,
} satisfies Input;
export const exampleOutput = {
  breakevenWasteOreMassRatio: 5,
  preStrippingMarginPerOreTonne: 50,
  economicPositiveMargin: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stripping-ratio-breakeven",
  title: "Breakeven Stripping Ratio",
  description:
    "Estimate breakeven waste/ore mass ratio from recovered revenue and incremental costs; negative margins are retained, not converted into feasible stripping plans.",
  inputs: inputFields,
  outputs: [
    {
      id: "breakevenWasteOreMassRatio",
      label: "Breakeven waste ore mass ratio",
      kind: "number",
    },
    {
      id: "preStrippingMarginPerOreTonne",
      label: "Pre stripping margin per ore tonne",
      kind: "number",
    },
    {
      id: "economicPositiveMargin",
      label: "Economic positive margin",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      recoveredRevenuePerOreTonne: value.recoveredRevenuePerOreTonne as number,
      oreMiningCostPerTonne: value.oreMiningCostPerTonne as number,
      processingCostPerOreTonne: value.processingCostPerOreTonne as number,
      wasteCostPerTonne: value.wasteCostPerTonne as number,
    }),
});
export const run = tool.execute;
export default tool;
