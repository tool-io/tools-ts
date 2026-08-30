import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly designatedHousingAllowance: number;
  readonly actualHousingExpenses: number;
  readonly fairRentalValue: number;
  readonly ministerialCompensation: number;
}>;
export type Output = Readonly<{
  readonly excludableHousingAllowance: number;
  readonly taxableHousingAllowance: number;
  readonly limitingFactor: string;
}>;

export const calculate = (input: Input): Output => {
  const entries = [
    { value: input.designatedHousingAllowance, label: "designated" },
    { value: input.actualHousingExpenses, label: "expenses" },
    { value: input.fairRentalValue, label: "rental-value" },
    { value: input.ministerialCompensation, label: "compensation" },
  ] as const;
  const limiting = entries.reduce((best, item) =>
    item.value < best.value ? item : best,
  );
  return {
    excludableHousingAllowance: limiting.value,
    taxableHousingAllowance: input.designatedHousingAllowance - limiting.value,
    limitingFactor: limiting.label,
  };
};

export const exampleInput = {
  designatedHousingAllowance: 1000,
  actualHousingExpenses: 800,
  fairRentalValue: 900,
  ministerialCompensation: 2000,
} satisfies Input;
export const exampleOutput = {
  excludableHousingAllowance: 800,
  taxableHousingAllowance: 200,
  limitingFactor: "expenses",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      designatedHousingAllowance: input.designatedHousingAllowance as number,
      actualHousingExpenses: input.actualHousingExpenses as number,
      fairRentalValue: input.fairRentalValue as number,
      ministerialCompensation: input.ministerialCompensation as number,
    }),
  description:
    "Calculate housing-allowance exclusion from caller-supplied limiting amounts.",
  id: "taxation/housing-allowance-exclusion",
  inputs: [
    {
      id: "designatedHousingAllowance",
      label: "Designated housing allowance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "actualHousingExpenses",
      label: "Actual housing expenses",
      kind: "number",
      minimum: 0,
    },
    {
      id: "fairRentalValue",
      label: "Fair rental value including utilities",
      kind: "number",
      minimum: 0,
    },
    {
      id: "ministerialCompensation",
      label: "Ministerial compensation",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "excludableHousingAllowance",
      label: "Excludable housing allowance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "taxableHousingAllowance",
      label: "Taxable housing allowance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "limitingFactor",
      label: "Limiting factor",
      kind: "string",
      enum: ["designated", "expenses", "rental-value", "compensation"],
    },
  ],
  title: "Housing Allowance Exclusion",
});

export const run = tool.execute;
export default tool;
