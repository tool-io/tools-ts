import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NetFreightAfterDiscountFscInput = {
  readonly linehaulChargeUsd: number;
  readonly discountPercent?: number;
  readonly fuelSurchargePercent?: number;
};

export type NetFreightAfterDiscountFscOutput = {
  readonly discountedLinehaulUsd: number;
  readonly fuelSurchargeUsd: number;
  readonly netFreightUsd: number;
};

export const calculateNetFreightAfterDiscountFsc = (
  input: NetFreightAfterDiscountFscInput,
): NetFreightAfterDiscountFscOutput => {
  if (!Number.isFinite(input.linehaulChargeUsd) || input.linehaulChargeUsd < 0)
    return simpleError(
      "linehaulChargeUsd",
      "The linehaul charge must be finite and non-negative.",
      "invalid_amount",
    );
  const discountPercent = input.discountPercent ?? 0;
  const fuelSurchargePercent = input.fuelSurchargePercent ?? 0;
  if (
    !Number.isFinite(discountPercent) ||
    discountPercent < 0 ||
    discountPercent > 100
  )
    return simpleError(
      "discountPercent",
      "The discount must be between zero and one hundred percent.",
      "invalid_percent",
    );
  if (!Number.isFinite(fuelSurchargePercent) || fuelSurchargePercent < 0)
    return simpleError(
      "fuelSurchargePercent",
      "The fuel surcharge percentage must be finite and non-negative.",
      "invalid_percent",
    );
  const discountedLinehaulUsd =
    input.linehaulChargeUsd * (1 - discountPercent / 100);
  const fuelSurchargeUsd = discountedLinehaulUsd * (fuelSurchargePercent / 100);
  const netFreightUsd = discountedLinehaulUsd + fuelSurchargeUsd;
  if (
    !Number.isFinite(discountedLinehaulUsd) ||
    !Number.isFinite(fuelSurchargeUsd) ||
    !Number.isFinite(netFreightUsd) ||
    (discountedLinehaulUsd > 0 &&
      fuelSurchargePercent > 0 &&
      fuelSurchargeUsd <= 0)
  )
    return simpleError(
      "linehaulChargeUsd",
      "The adjusted freight charge is outside the representable range.",
      "charge_out_of_range",
    );
  return {
    discountedLinehaulUsd,
    fuelSurchargeUsd,
    netFreightUsd,
  };
};

export const netFreightAfterDiscountFscExample = {
  input: {
    linehaulChargeUsd: 2400,
    discountPercent: 8,
    fuelSurchargePercent: 22.5,
  },
  output: {
    discountedLinehaulUsd: 2208,
    fuelSurchargeUsd: 496.8,
    netFreightUsd: 2704.8,
  },
} satisfies ToolExample<
  NetFreightAfterDiscountFscInput,
  NetFreightAfterDiscountFscOutput
>;

export const netFreightAfterDiscountFscTool = createSimpleTool({
  id: "logistics/net-freight-after-discount-fsc",
  title: "Net Freight After Discount and FSC",
  description:
    "Compute net freight by applying the negotiated percent discount to the linehaul first and then adding the fuel surcharge on the discounted amount.",
  inputs: [
    {
      description: "Linehaul charge before adjustments, in US dollars.",
      id: "linehaulChargeUsd",
      kind: "number",
      label: "Linehaul",
      minimum: 0,
    },
    {
      default: 0,
      description:
        "Negotiated discount percentage applied to the linehaul (0-100).",
      id: "discountPercent",
      kind: "number",
      label: "Discount %",
      minimum: 0,
      maximum: 100,
    },
    {
      default: 0,
      description:
        "Fuel surcharge percentage applied to the discounted linehaul.",
      id: "fuelSurchargePercent",
      kind: "number",
      label: "FSC %",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Linehaul after the discount, in US dollars.",
      id: "discountedLinehaulUsd",
      kind: "number",
      label: "Discounted linehaul",
    },
    {
      description: "Fuel surcharge on the discounted linehaul, in US dollars.",
      id: "fuelSurchargeUsd",
      kind: "number",
      label: "Fuel surcharge",
    },
    {
      description: "Net freight payable, in US dollars.",
      id: "netFreightUsd",
      kind: "number",
      label: "Net freight",
    },
  ],
  calculate: (input) =>
    calculateNetFreightAfterDiscountFsc({
      discountPercent: input.discountPercent as number | undefined,
      fuelSurchargePercent: input.fuelSurchargePercent as number | undefined,
      linehaulChargeUsd: input.linehaulChargeUsd as number,
    }),
});

export const runNetFreightAfterDiscountFsc =
  netFreightAfterDiscountFscTool.execute;
export default netFreightAfterDiscountFscTool;
