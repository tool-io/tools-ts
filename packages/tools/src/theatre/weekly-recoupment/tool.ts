import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly weeklyGross: number;
  readonly weeklyVariableCosts: number;
  readonly weeklyFixedCosts: number;
  readonly unrecoupedCapital: number;
}>;
export type Output = Readonly<{
  readonly weeklyRecoupment: number;
  readonly projectedWeeksToRecoup: number;
  readonly currentlyRecouping: boolean;
}>;

export const calculate = (input: Input): Output => {
  const weeklyRecoupment =
    input.weeklyGross - input.weeklyVariableCosts - input.weeklyFixedCosts;
  if (weeklyRecoupment <= 0)
    return {
      weeklyRecoupment,
      projectedWeeksToRecoup: 0,
      currentlyRecouping: false,
    };
  return {
    weeklyRecoupment,
    projectedWeeksToRecoup: input.unrecoupedCapital / weeklyRecoupment,
    currentlyRecouping: true,
  };
};

export const exampleInput = {
  weeklyGross: 500000,
  weeklyVariableCosts: 100000,
  weeklyFixedCosts: 300000,
  unrecoupedCapital: 2000000,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  weeklyGross: 300000,
  weeklyVariableCosts: 100000,
  weeklyFixedCosts: 250000,
  unrecoupedCapital: 2000000,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      weeklyGross: input.weeklyGross as number,
      weeklyVariableCosts: input.weeklyVariableCosts as number,
      weeklyFixedCosts: input.weeklyFixedCosts as number,
      unrecoupedCapital: input.unrecoupedCapital as number,
    }),
  description:
    "Calculate weekly recoupment and a simple remaining-capital horizon.",
  id: "theatre/weekly-recoupment",
  inputs: [
    {
      id: "weeklyGross",
      label: "Weekly gross",
      kind: "number",
      minimum: 0,
      unit: "currency/week",
    },
    {
      id: "weeklyVariableCosts",
      label: "Weekly variable costs",
      kind: "number",
      minimum: 0,
      unit: "currency/week",
    },
    {
      id: "weeklyFixedCosts",
      label: "Weekly fixed costs",
      kind: "number",
      minimum: 0,
      unit: "currency/week",
    },
    {
      id: "unrecoupedCapital",
      label: "Unrecouped capital",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "weeklyRecoupment",
      label: "Weekly recoupment",
      kind: "number",
      unit: "currency/week",
    },
    {
      id: "projectedWeeksToRecoup",
      label: "Projected weeks to recoup",
      kind: "number",
      minimum: 0,
      unit: "weeks",
    },
    { id: "currentlyRecouping", label: "Currently recouping", kind: "boolean" },
  ],
  title: "Weekly Recoupment",
});

export const run = tool.execute;
export default tool;
