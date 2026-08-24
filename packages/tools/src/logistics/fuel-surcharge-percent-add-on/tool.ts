import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelSurchargePercentAddOnInput = {
  readonly baseChargeUsd: number;
  readonly fuelSurchargePercent: number;
};

export type FuelSurchargePercentAddOnOutput = {
  readonly surchargeAmountUsd: number;
  readonly totalChargeUsd: number;
};

export const calculateFuelSurchargePercentAddOn = (
  input: FuelSurchargePercentAddOnInput,
): FuelSurchargePercentAddOnOutput => {
  if (!Number.isFinite(input.baseChargeUsd) || input.baseChargeUsd < 0)
    return simpleError(
      "baseChargeUsd",
      "The base charge must be finite and non-negative.",
      "invalid_amount",
    );
  if (
    !Number.isFinite(input.fuelSurchargePercent) ||
    input.fuelSurchargePercent < 0
  )
    return simpleError(
      "fuelSurchargePercent",
      "The fuel surcharge percentage must be finite and non-negative.",
      "invalid_percent",
    );
  let surchargeAmountUsd =
    input.baseChargeUsd * (input.fuelSurchargePercent / 100);
  if (
    surchargeAmountUsd === 0 &&
    input.baseChargeUsd > 0 &&
    input.fuelSurchargePercent > 0
  )
    surchargeAmountUsd =
      (input.baseChargeUsd / 100) * input.fuelSurchargePercent;
  if (
    !Number.isFinite(surchargeAmountUsd) ||
    (input.baseChargeUsd > 0 &&
      input.fuelSurchargePercent > 0 &&
      surchargeAmountUsd <= 0)
  )
    return simpleError(
      "fuelSurchargePercent",
      "The surcharge amount is outside the representable range.",
      "surcharge_out_of_range",
    );
  const totalChargeUsd = input.baseChargeUsd + surchargeAmountUsd;
  if (!Number.isFinite(totalChargeUsd))
    return simpleError(
      "baseChargeUsd",
      "The total charge is outside the representable range.",
      "total_out_of_range",
    );
  return { surchargeAmountUsd, totalChargeUsd };
};

export const fuelSurchargePercentAddOnExample = {
  input: { baseChargeUsd: 1000, fuelSurchargePercent: 16.5 },
  output: { surchargeAmountUsd: 165, totalChargeUsd: 1165 },
} satisfies ToolExample<
  FuelSurchargePercentAddOnInput,
  FuelSurchargePercentAddOnOutput
>;

export const fuelSurchargePercentAddOnTool = createSimpleTool({
  id: "logistics/fuel-surcharge-percent-add-on",
  title: "Fuel Surcharge Percent Add-On Calculator",
  description:
    "Add a percentage-based fuel (or emission) surcharge from your carrier tariff to a base freight charge.",
  inputs: [
    {
      description: "Base freight charge in US dollars.",
      id: "baseChargeUsd",
      kind: "number",
      label: "Base charge",
      minimum: 0,
      unit: "USD",
    },
    {
      description:
        "Surcharge percentage from the tariff table; values above 100% are allowed.",
      id: "fuelSurchargePercent",
      kind: "number",
      label: "Surcharge %",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Surcharge amount added on top of the base charge.",
      id: "surchargeAmountUsd",
      kind: "number",
      label: "Surcharge",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Base charge plus surcharge.",
      id: "totalChargeUsd",
      kind: "number",
      label: "Total charge",
      minimum: 0,
      unit: "USD",
    },
  ],
  calculate: (input) =>
    calculateFuelSurchargePercentAddOn({
      baseChargeUsd: input.baseChargeUsd as number,
      fuelSurchargePercent: input.fuelSurchargePercent as number,
    }),
});

export const runFuelSurchargePercentAddOn =
  fuelSurchargePercentAddOnTool.execute;
export default fuelSurchargePercentAddOnTool;
