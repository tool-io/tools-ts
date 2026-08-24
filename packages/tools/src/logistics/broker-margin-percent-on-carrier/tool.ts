import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrokerMarginPercentOnCarrierInput = {
  readonly carrierPayUsd: number;
  readonly shipperPayUsd: number;
};

export type BrokerMarginPercentOnCarrierOutput = {
  readonly brokerMarginUsd: number;
  readonly marginPercentOnCarrier: number;
};

export const calculateBrokerMarginPercentOnCarrier = (
  input: BrokerMarginPercentOnCarrierInput,
): BrokerMarginPercentOnCarrierOutput => {
  if (!Number.isFinite(input.carrierPayUsd) || input.carrierPayUsd <= 0)
    return simpleError(
      "carrierPayUsd",
      "Carrier pay must be finite and greater than zero.",
      "invalid_pay",
    );
  if (!Number.isFinite(input.shipperPayUsd) || input.shipperPayUsd < 0)
    return simpleError(
      "shipperPayUsd",
      "Shipper pay must be finite and non-negative.",
      "invalid_pay",
    );
  const brokerMarginUsd = input.shipperPayUsd - input.carrierPayUsd;
  const marginPercentOnCarrier = (brokerMarginUsd / input.carrierPayUsd) * 100;
  if (!Number.isFinite(marginPercentOnCarrier))
    return simpleError(
      "shipperPayUsd",
      "The margin percentage is too large to represent.",
      "result_out_of_range",
    );
  return {
    brokerMarginUsd,
    marginPercentOnCarrier,
  };
};

export const brokerMarginPercentOnCarrierExample = {
  input: { carrierPayUsd: 2450, shipperPayUsd: 2800 },
  output: { brokerMarginUsd: 350, marginPercentOnCarrier: 14.285714285714285 },
} satisfies ToolExample<
  BrokerMarginPercentOnCarrierInput,
  BrokerMarginPercentOnCarrierOutput
>;

export const brokerMarginPercentOnCarrierTool = createSimpleTool({
  id: "logistics/broker-margin-percent-on-carrier",
  title: "Broker Margin Percent on Carrier Calculator",
  description:
    "Compute a freight broker's dollar spread and its percentage relative to carrier pay; this carrier-cost basis differs from gross margin on shipper revenue.",
  inputs: [
    {
      description: "Amount paid by the shipper for the load in USD.",
      id: "shipperPayUsd",
      kind: "number",
      label: "Shipper pay",
      minimum: 0,
      unit: "USD",
    },
    {
      description:
        "Amount paid to the carrier for the load in USD; this is the percentage denominator.",
      id: "carrierPayUsd",
      kind: "number",
      label: "Carrier pay",
      minimum: Number.MIN_VALUE,
      unit: "USD",
    },
  ],
  outputs: [
    {
      description:
        "Shipper pay minus carrier pay; a negative result is a loss.",
      id: "brokerMarginUsd",
      kind: "number",
      label: "Margin",
      unit: "USD",
    },
    {
      description:
        "Dollar spread divided by carrier pay, expressed as a percentage.",
      id: "marginPercentOnCarrier",
      kind: "number",
      label: "Margin on carrier pay",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBrokerMarginPercentOnCarrier({
      carrierPayUsd: input.carrierPayUsd as number,
      shipperPayUsd: input.shipperPayUsd as number,
    }),
});

export const runBrokerMarginPercentOnCarrier =
  brokerMarginPercentOnCarrierTool.execute;
export default brokerMarginPercentOnCarrierTool;
