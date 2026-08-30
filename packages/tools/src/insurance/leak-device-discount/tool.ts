import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly basePremium: number;
  readonly deviceDiscountPercent: number;
  readonly deviceAnnualCost: number;
  readonly expectedAvoidedLoss: number;
}>;
export type Output = Readonly<{
  readonly premiumDiscount: number;
  readonly discountedPremium: number;
  readonly annualNetBenefit: number;
  readonly paybackYears: number;
}>;

export const calculate = (input: Input): Output => {
  const premiumDiscount =
      (input.basePremium * input.deviceDiscountPercent) / 100,
    discountedPremium = input.basePremium - premiumDiscount,
    annualBenefit = premiumDiscount + input.expectedAvoidedLoss,
    annualNetBenefit = annualBenefit - input.deviceAnnualCost;
  return {
    premiumDiscount,
    discountedPremium,
    annualNetBenefit,
    paybackYears:
      annualBenefit === 0 ? 0 : input.deviceAnnualCost / annualBenefit,
  };
};

export const exampleInput = {
  basePremium: 1000,
  deviceDiscountPercent: 10,
  deviceAnnualCost: 100,
  expectedAvoidedLoss: 100,
} satisfies Input;
export const exampleOutput = {
  premiumDiscount: 100,
  discountedPremium: 900,
  annualNetBenefit: 100,
  paybackYears: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      basePremium: input.basePremium as number,
      deviceDiscountPercent: input.deviceDiscountPercent as number,
      deviceAnnualCost: input.deviceAnnualCost as number,
      expectedAvoidedLoss: input.expectedAvoidedLoss as number,
    }),
  description:
    "Calculate leak-device premium discount and simple annual benefit.",
  id: "insurance/leak-device-discount",
  inputs: [
    { id: "basePremium", label: "Base premium", kind: "number", minimum: 0 },
    {
      id: "deviceDiscountPercent",
      label: "Leak-device discount",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "deviceAnnualCost",
      label: "Annual device cost",
      kind: "number",
      minimum: 0,
    },
    {
      id: "expectedAvoidedLoss",
      label: "Expected avoided loss",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "premiumDiscount",
      label: "Premium discount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "discountedPremium",
      label: "Discounted premium",
      kind: "number",
      minimum: 0,
    },
    { id: "annualNetBenefit", label: "Annual net benefit", kind: "number" },
    {
      id: "paybackYears",
      label: "Simple payback period",
      kind: "number",
      minimum: 0,
      unit: "years",
    },
  ],
  title: "Leak-Device Discount",
});

export const run = tool.execute;
export default tool;
