import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstBalance: number;
  readonly firstApyPercent: number;
  readonly firstAnnualFees: number;
  readonly secondBalance: number;
  readonly secondApyPercent: number;
  readonly secondAnnualFees: number;
}>;
export type Output = Readonly<{
  readonly firstNetAnnualValue: number;
  readonly secondNetAnnualValue: number;
  readonly preferredOption: string;
}>;

export const calculate = (input: Input): Output => {
  const firstNetAnnualValue =
    (input.firstBalance * input.firstApyPercent) / 100 - input.firstAnnualFees;
  const secondNetAnnualValue =
    (input.secondBalance * input.secondApyPercent) / 100 -
    input.secondAnnualFees;
  return {
    firstNetAnnualValue,
    secondNetAnnualValue,
    preferredOption:
      firstNetAnnualValue === secondNetAnnualValue
        ? "tie"
        : firstNetAnnualValue > secondNetAnnualValue
          ? "first"
          : "second",
  };
};

export const exampleInput = {
  firstBalance: 10000,
  firstApyPercent: 4,
  firstAnnualFees: 0,
  secondBalance: 10000,
  secondApyPercent: 4.2,
  secondAnnualFees: 30,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  firstBalance: 1000,
  firstApyPercent: 1,
  firstAnnualFees: 0,
  secondBalance: 1000,
  secondApyPercent: 1,
  secondAnnualFees: 0,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstBalance: input.firstBalance as number,
      firstApyPercent: input.firstApyPercent as number,
      firstAnnualFees: input.firstAnnualFees as number,
      secondBalance: input.secondBalance as number,
      secondApyPercent: input.secondApyPercent as number,
      secondAnnualFees: input.secondAnnualFees as number,
    }),
  description:
    "Compare two deposit accounts from balances, disclosed APYs, and annual fees.",
  id: "banking/deposit-account-comparison",
  inputs: [
    {
      id: "firstBalance",
      label: "First balance",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    { id: "firstApyPercent", label: "First APY", kind: "number", unit: "%" },
    {
      id: "firstAnnualFees",
      label: "First annual fees",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "secondBalance",
      label: "Second balance",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    { id: "secondApyPercent", label: "Second APY", kind: "number", unit: "%" },
    {
      id: "secondAnnualFees",
      label: "Second annual fees",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "firstNetAnnualValue",
      label: "First net annual value",
      kind: "number",
      unit: "currency",
    },
    {
      id: "secondNetAnnualValue",
      label: "Second net annual value",
      kind: "number",
      unit: "currency",
    },
    {
      id: "preferredOption",
      label: "Higher net option",
      kind: "string",
      enum: ["first", "second", "tie"],
    },
  ],
  title: "Deposit Account Comparison",
});

export const run = tool.execute;
export default tool;
