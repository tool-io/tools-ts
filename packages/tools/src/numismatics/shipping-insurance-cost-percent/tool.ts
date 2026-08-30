import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShippingInsuranceCostPercentInput = Readonly<{
  readonly insuranceCost: number;
  readonly insuredValue: number;
}>;
export type ShippingInsuranceCostPercentOutput = Readonly<{
  readonly insuranceCostPercent: number;
}>;

export const calculateShippingInsuranceCostPercent = (
  x: ShippingInsuranceCostPercentInput,
): ShippingInsuranceCostPercentOutput => {
  if (!Number.isFinite(x.insuranceCost) || x.insuranceCost < 0)
    simpleError("insuranceCost", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.insuredValue) || x.insuredValue <= 0)
    simpleError("insuredValue", "Provide a finite positive number.");
  const insuranceCostPercent = (x.insuranceCost / x.insuredValue) * 100;
  if (!Number.isFinite(insuranceCostPercent))
    simpleError(
      "insuranceCostPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    insuranceCostPercent: Object.is(insuranceCostPercent, -0)
      ? 0
      : insuranceCostPercent,
  };
};

export const example = {
  input: {
    insuranceCost: 4,
    insuredValue: 200,
  },
  output: { insuranceCostPercent: 2 },
} satisfies ToolExample<
  ShippingInsuranceCostPercentInput,
  ShippingInsuranceCostPercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/shipping-insurance-cost-percent",
  title: "Shipping Insurance Cost Percent",
  description:
    "Compare shipping-insurance premium with declared insured value.",
  inputs: [
    {
      id: "insuranceCost",
      kind: "number",
      label: "Insurance Cost",
      unit: "currency",
    },
    {
      id: "insuredValue",
      kind: "number",
      label: "Insured Value",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "insuranceCostPercent",
      kind: "number",
      label: "Insurance Cost Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateShippingInsuranceCostPercent({
      insuranceCost: input.insuranceCost as number,
      insuredValue: input.insuredValue as number,
    }),
});
export const runShippingInsuranceCostPercent = tool.execute;
export default tool;
