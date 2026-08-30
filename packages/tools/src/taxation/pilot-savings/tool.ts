import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly standardPropertyTax: number;
  readonly pilotPayment: number;
  readonly agreementCosts: number;
}>;
export type Output = Readonly<{
  readonly grossTaxSavings: number;
  readonly netSavings: number;
  readonly effectiveDiscountPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.standardPropertyTax <= 0)
    simpleError(
      "standardPropertyTax",
      "Standard property tax must be positive.",
      "invalid_baseline",
    );
  const grossTaxSavings = input.standardPropertyTax - input.pilotPayment;
  return {
    grossTaxSavings,
    netSavings: grossTaxSavings - input.agreementCosts,
    effectiveDiscountPercent:
      (grossTaxSavings / input.standardPropertyTax) * 100,
  };
};

export const exampleInput = {
  standardPropertyTax: 1000,
  pilotPayment: 700,
  agreementCosts: 50,
} satisfies Input;
export const exampleOutput = {
  grossTaxSavings: 300,
  netSavings: 250,
  effectiveDiscountPercent: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      standardPropertyTax: input.standardPropertyTax as number,
      pilotPayment: input.pilotPayment as number,
      agreementCosts: input.agreementCosts as number,
    }),
  description: "Compare a PILOT payment and costs with standard property tax.",
  id: "taxation/pilot-savings",
  inputs: [
    {
      id: "standardPropertyTax",
      label: "Standard property tax",
      kind: "number",
      minimum: 0,
    },
    { id: "pilotPayment", label: "PILOT payment", kind: "number", minimum: 0 },
    {
      id: "agreementCosts",
      label: "Agreement costs",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "grossTaxSavings", label: "Gross tax savings", kind: "number" },
    { id: "netSavings", label: "Net savings", kind: "number" },
    {
      id: "effectiveDiscountPercent",
      label: "Effective discount",
      kind: "number",
      unit: "%",
    },
  ],
  title: "PILOT Savings",
});

export const run = tool.execute;
export default tool;
