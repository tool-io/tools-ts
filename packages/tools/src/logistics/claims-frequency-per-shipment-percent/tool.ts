import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClaimsFrequencyPerShipmentPercentInput = {
  readonly cargoClaimsFiled: number;
  readonly shipmentsDelivered: number;
};

export type ClaimsFrequencyPerShipmentPercentOutput = {
  readonly claimsFrequencyPercent: number;
};

export const calculateClaimsFrequencyPerShipmentPercent = (
  input: ClaimsFrequencyPerShipmentPercentInput,
): ClaimsFrequencyPerShipmentPercentOutput => {
  if (
    !Number.isSafeInteger(input.shipmentsDelivered) ||
    input.shipmentsDelivered <= 0
  )
    return simpleError(
      "shipmentsDelivered",
      "Shipments delivered must be a positive safe integer.",
      "invalid_shipments",
    );
  if (
    !Number.isSafeInteger(input.cargoClaimsFiled) ||
    input.cargoClaimsFiled < 0
  )
    return simpleError(
      "cargoClaimsFiled",
      "Cargo claims filed must be a non-negative safe integer.",
      "invalid_claims",
    );
  return {
    claimsFrequencyPercent:
      (input.cargoClaimsFiled / input.shipmentsDelivered) * 100,
  };
};

export const claimsFrequencyPerShipmentPercentExample = {
  input: { cargoClaimsFiled: 37, shipmentsDelivered: 1850 },
  output: { claimsFrequencyPercent: 2 },
} satisfies ToolExample<
  ClaimsFrequencyPerShipmentPercentInput,
  ClaimsFrequencyPerShipmentPercentOutput
>;

export const claimsFrequencyPerShipmentPercentTool = createSimpleTool({
  id: "logistics/claims-frequency-per-shipment-percent",
  title: "Claims Frequency Per Shipment Percent Calculator",
  description:
    "Compute cargo claim filings per 100 delivered shipments; results can exceed 100% when multiple claims may be filed for a shipment.",
  inputs: [
    {
      description: "Number of cargo claims filed for the period.",
      id: "cargoClaimsFiled",
      kind: "integer",
      label: "Claims filed",
      minimum: 0,
    },
    {
      description: "Number of shipments delivered in the same period.",
      id: "shipmentsDelivered",
      kind: "integer",
      label: "Shipments delivered",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Claim filings per 100 delivered shipments.",
      id: "claimsFrequencyPercent",
      kind: "number",
      label: "Claims frequency",
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateClaimsFrequencyPerShipmentPercent({
      cargoClaimsFiled: input.cargoClaimsFiled as number,
      shipmentsDelivered: input.shipmentsDelivered as number,
    }),
});

export const runClaimsFrequencyPerShipmentPercent =
  claimsFrequencyPerShipmentPercentTool.execute;
export default claimsFrequencyPerShipmentPercentTool;
