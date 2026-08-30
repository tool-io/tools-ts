import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly averageWeeklyUse: number;
  readonly leadTimeWeeks: number;
  readonly reviewPeriodWeeks: number;
  readonly safetyStock: number;
  readonly onHand: number;
}>;
export type Output = Readonly<{
  readonly parLevel: number;
  readonly reorderQuantity: number;
}>;

export const calculate = (input: Input): Output => {
  const parLevel = Math.ceil(
    input.averageWeeklyUse * (input.leadTimeWeeks + input.reviewPeriodWeeks) +
      input.safetyStock,
  );
  return { parLevel, reorderQuantity: Math.max(0, parLevel - input.onHand) };
};

export const exampleInput = {
  averageWeeklyUse: 4.5,
  leadTimeWeeks: 2,
  reviewPeriodWeeks: 1,
  safetyStock: 3,
  onHand: 8,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  averageWeeklyUse: 0,
  leadTimeWeeks: 2,
  reviewPeriodWeeks: 1,
  safetyStock: 3,
  onHand: 5,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      averageWeeklyUse: input.averageWeeklyUse as number,
      leadTimeWeeks: input.leadTimeWeeks as number,
      reviewPeriodWeeks: input.reviewPeriodWeeks as number,
      safetyStock: input.safetyStock as number,
      onHand: input.onHand as number,
    }),
  description:
    "Calculate a lamp par level and reorder quantity from use, lead time, and safety stock.",
  id: "theatre/lamp-inventory-par",
  inputs: [
    {
      id: "averageWeeklyUse",
      label: "Average weekly lamp use",
      kind: "number",
      minimum: 0,
      unit: "lamps/week",
    },
    {
      id: "leadTimeWeeks",
      label: "Replenishment lead time",
      kind: "number",
      minimum: 0,
      unit: "weeks",
    },
    {
      id: "reviewPeriodWeeks",
      label: "Inventory review period",
      kind: "number",
      minimum: 0,
      unit: "weeks",
    },
    {
      id: "safetyStock",
      label: "Safety stock",
      kind: "integer",
      minimum: 0,
      unit: "lamps",
    },
    {
      id: "onHand",
      label: "Current on-hand stock",
      kind: "integer",
      minimum: 0,
      unit: "lamps",
    },
  ],
  outputs: [
    {
      id: "parLevel",
      label: "Recommended par level",
      kind: "integer",
      minimum: 0,
      unit: "lamps",
    },
    {
      id: "reorderQuantity",
      label: "Reorder quantity",
      kind: "integer",
      minimum: 0,
      unit: "lamps",
    },
  ],
  title: "Lamp Inventory Par",
});

export const run = tool.execute;
export default tool;
