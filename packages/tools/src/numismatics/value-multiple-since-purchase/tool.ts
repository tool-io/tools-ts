import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ValueMultipleSincePurchaseInput = Readonly<{
  readonly currentValue: number;
  readonly purchaseCost: number;
}>;
export type ValueMultipleSincePurchaseOutput = Readonly<{
  readonly valueMultiple: number;
}>;

export const calculateValueMultipleSincePurchase = (
  x: ValueMultipleSincePurchaseInput,
): ValueMultipleSincePurchaseOutput => {
  if (!Number.isFinite(x.currentValue) || x.currentValue < 0)
    simpleError("currentValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.purchaseCost) || x.purchaseCost <= 0)
    simpleError("purchaseCost", "Provide a finite positive number.");
  const valueMultiple = x.currentValue / x.purchaseCost;
  if (!Number.isFinite(valueMultiple))
    simpleError(
      "valueMultiple",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { valueMultiple: Object.is(valueMultiple, -0) ? 0 : valueMultiple };
};

export const example = {
  input: {
    currentValue: 300,
    purchaseCost: 100,
  },
  output: { valueMultiple: 3 },
} satisfies ToolExample<
  ValueMultipleSincePurchaseInput,
  ValueMultipleSincePurchaseOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/value-multiple-since-purchase",
  title: "Value Multiple Since Purchase",
  description:
    "Express current gross value as a multiple of original purchase cost, before fees and inflation.",
  inputs: [
    {
      id: "currentValue",
      kind: "number",
      label: "Current Value",
      unit: "currency",
    },
    {
      id: "purchaseCost",
      kind: "number",
      label: "Purchase Cost",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "valueMultiple",
      kind: "number",
      label: "Value Multiple",
      unit: "ratio",
    },
  ],
  calculate: (input) =>
    calculateValueMultipleSincePurchase({
      currentValue: input.currentValue as number,
      purchaseCost: input.purchaseCost as number,
    }),
});
export const runValueMultipleSincePurchase = tool.execute;
export default tool;
