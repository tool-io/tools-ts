import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly qualifiedForeignHousingExpenses: number;
  readonly baseHousingAmount: number;
  readonly locationCap: number;
}>;
export type Output = Readonly<{
  readonly expensesAboveBase: number;
  readonly foreignHousingExclusion: number;
  readonly expensesAboveCap: number;
}>;

export const calculate = (input: Input): Output => {
  const expensesAboveBase = Math.max(
    0,
    input.qualifiedForeignHousingExpenses - input.baseHousingAmount,
  );
  const foreignHousingExclusion = Math.min(
    expensesAboveBase,
    input.locationCap,
  );
  return {
    expensesAboveBase,
    foreignHousingExclusion,
    expensesAboveCap: Math.max(0, expensesAboveBase - input.locationCap),
  };
};

export const exampleInput = {
  qualifiedForeignHousingExpenses: 30000,
  baseHousingAmount: 10000,
  locationCap: 15000,
} satisfies Input;
export const exampleOutput = {
  expensesAboveBase: 20000,
  foreignHousingExclusion: 15000,
  expensesAboveCap: 5000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      qualifiedForeignHousingExpenses:
        input.qualifiedForeignHousingExpenses as number,
      baseHousingAmount: input.baseHousingAmount as number,
      locationCap: input.locationCap as number,
    }),
  description:
    "Calculate foreign housing exclusion using caller-supplied base and location cap.",
  id: "taxation/foreign-housing-exclusion",
  inputs: [
    {
      id: "qualifiedForeignHousingExpenses",
      label: "Qualified foreign housing expenses",
      kind: "number",
      minimum: 0,
    },
    {
      id: "baseHousingAmount",
      label: "Base housing amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "locationCap",
      label: "Caller location cap",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "expensesAboveBase",
      label: "Expenses above base",
      kind: "number",
      minimum: 0,
    },
    {
      id: "foreignHousingExclusion",
      label: "Foreign housing exclusion",
      kind: "number",
      minimum: 0,
    },
    {
      id: "expensesAboveCap",
      label: "Expenses above supplied cap",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Foreign Housing Exclusion",
});

export const run = tool.execute;
export default tool;
