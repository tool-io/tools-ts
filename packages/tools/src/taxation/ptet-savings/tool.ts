import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly entityTaxPaid: number;
  readonly ownerCreditPercent: number;
  readonly federalMarginalRatePercent: number;
}>;
export type Output = Readonly<{
  readonly ownerStateCredit: number;
  readonly unrecoveredEntityTax: number;
  readonly estimatedFederalTaxSavings: number;
  readonly estimatedNetBenefit: number;
}>;

export const calculate = (input: Input): Output => {
  const ownerStateCredit =
    (input.entityTaxPaid * input.ownerCreditPercent) / 100;
  const unrecoveredEntityTax = input.entityTaxPaid - ownerStateCredit;
  const estimatedFederalTaxSavings =
    (input.entityTaxPaid * input.federalMarginalRatePercent) / 100;
  return {
    ownerStateCredit,
    unrecoveredEntityTax,
    estimatedFederalTaxSavings,
    estimatedNetBenefit: estimatedFederalTaxSavings - unrecoveredEntityTax,
  };
};

export const exampleInput = {
  entityTaxPaid: 100,
  ownerCreditPercent: 100,
  federalMarginalRatePercent: 30,
} satisfies Input;
export const exampleOutput = {
  ownerStateCredit: 100,
  unrecoveredEntityTax: 0,
  estimatedFederalTaxSavings: 30,
  estimatedNetBenefit: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      entityTaxPaid: input.entityTaxPaid as number,
      ownerCreditPercent: input.ownerCreditPercent as number,
      federalMarginalRatePercent: input.federalMarginalRatePercent as number,
    }),
  description:
    "Estimate PTET owner credit, unrecovered tax, and federal tax savings from supplied rates.",
  id: "taxation/ptet-savings",
  inputs: [
    {
      id: "entityTaxPaid",
      label: "Entity-level PTET paid",
      kind: "number",
      minimum: 0,
    },
    {
      id: "ownerCreditPercent",
      label: "Owner state-credit percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "federalMarginalRatePercent",
      label: "Federal marginal rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "ownerStateCredit",
      label: "Owner state credit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "unrecoveredEntityTax",
      label: "Unrecovered entity tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "estimatedFederalTaxSavings",
      label: "Estimated federal savings",
      kind: "number",
      minimum: 0,
    },
    {
      id: "estimatedNetBenefit",
      label: "Estimated net benefit",
      kind: "number",
    },
  ],
  title: "PTET Savings",
});

export const run = tool.execute;
export default tool;
