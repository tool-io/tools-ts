import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PalletExchangePalletForPalletCreditBalanceInput = {
  readonly creditValuePerPallet: number;
  readonly palletsIssued: number;
  readonly palletsReturned: number;
};

export type PalletExchangePalletForPalletCreditBalanceOutput = {
  readonly creditBalanceValue: number;
  readonly palletBalance: number;
  readonly settlementDirection:
    "balanced" | "issuer_owes_pallets" | "recipient_owes_pallets";
};

export const calculatePalletExchangePalletForPalletCreditBalance = (
  input: PalletExchangePalletForPalletCreditBalanceInput,
): PalletExchangePalletForPalletCreditBalanceOutput => {
  if (
    !Number.isFinite(input.creditValuePerPallet) ||
    input.creditValuePerPallet <= 0
  )
    return simpleError(
      "creditValuePerPallet",
      "Credit value per pallet must be greater than zero.",
      "invalid_credit_value",
    );
  for (const key of ["palletsIssued", "palletsReturned"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 0))
      return simpleError(
        key,
        "Pallet counts must be non-negative whole numbers.",
        "invalid_pallet_count",
      );
  }
  const palletBalance = input.palletsIssued - input.palletsReturned;
  const creditBalanceValue = palletBalance * input.creditValuePerPallet;
  if (!Number.isFinite(creditBalanceValue))
    return simpleError(
      "creditValuePerPallet",
      "The credit balance is outside the representable range.",
      "balance_out_of_range",
    );
  return {
    creditBalanceValue,
    palletBalance,
    settlementDirection:
      palletBalance > 0
        ? "recipient_owes_pallets"
        : palletBalance < 0
          ? "issuer_owes_pallets"
          : "balanced",
  };
};

export const palletExchangePalletForPalletCreditBalanceExample = {
  input: { creditValuePerPallet: 22.5, palletsIssued: 48, palletsReturned: 44 },
  output: {
    creditBalanceValue: 90,
    palletBalance: 4,
    settlementDirection: "recipient_owes_pallets",
  },
} satisfies ToolExample<
  PalletExchangePalletForPalletCreditBalanceInput,
  PalletExchangePalletForPalletCreditBalanceOutput
>;

export const palletExchangePalletForPalletCreditBalanceTool = createSimpleTool({
  id: "logistics/pallet-exchange-pallet-for-pallet-credit-balance",
  title: "Pallet Exchange Credit Balance",
  description:
    "Settle a pallet-for-pallet exchange by netting issued against returned pallets and valuing the outstanding balance at an agreed credit per pallet.",
  inputs: [
    {
      description: "Agreed credit value per pallet in currency units.",
      id: "creditValuePerPallet",
      kind: "number",
      label: "Credit per pallet",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Pallets issued with outbound shipments.",
      id: "palletsIssued",
      kind: "integer",
      label: "Issued",
      minimum: 0,
    },
    {
      description: "Pallets returned on inbound shipments.",
      id: "palletsReturned",
      kind: "integer",
      label: "Returned",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Outstanding balance valued at the agreed credit per pallet.",
      id: "creditBalanceValue",
      kind: "number",
      label: "Credit balance",
    },
    {
      description: "Issued minus returned; positive means pallets still out.",
      id: "palletBalance",
      kind: "integer",
      label: "Pallet balance",
    },
    {
      description: "Which party owes pallets after settlement.",
      enum: ["recipient_owes_pallets", "balanced", "issuer_owes_pallets"],
      id: "settlementDirection",
      kind: "string",
      label: "Direction",
    },
  ],
  calculate: (input) =>
    calculatePalletExchangePalletForPalletCreditBalance({
      creditValuePerPallet: input.creditValuePerPallet as number,
      palletsIssued: input.palletsIssued as number,
      palletsReturned: input.palletsReturned as number,
    }),
});

export const runPalletExchangePalletForPalletCreditBalance =
  palletExchangePalletForPalletCreditBalanceTool.execute;
export default palletExchangePalletForPalletCreditBalanceTool;
