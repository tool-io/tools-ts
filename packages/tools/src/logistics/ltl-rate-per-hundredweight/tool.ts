import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LtlRatePerHundredweightInput = {
  readonly rateUsdPerCwt: number;
  readonly chargeableWeightLb: number;
  readonly accessorialTotalUsd?: number;
  readonly minimumChargeUsd?: number;
};

export type LtlRatePerHundredweightOutput = {
  readonly linehaulChargeUsd: number;
  readonly linehaulAfterFloorUsd: number;
  readonly totalChargeUsd: number;
};

export const calculateLtlRatePerHundredweight = (
  input: LtlRatePerHundredweightInput,
): LtlRatePerHundredweightOutput => {
  if (!Number.isFinite(input.rateUsdPerCwt) || input.rateUsdPerCwt <= 0)
    return simpleError(
      "rateUsdPerCwt",
      "The rate per hundredweight must be greater than zero.",
      "invalid_rate",
    );
  if (
    !Number.isFinite(input.chargeableWeightLb) ||
    input.chargeableWeightLb <= 0
  )
    return simpleError(
      "chargeableWeightLb",
      "Chargeable weight must be greater than zero pounds.",
      "invalid_weight",
    );
  const accessorialTotalUsd = input.accessorialTotalUsd ?? 0;
  const minimumChargeUsd = input.minimumChargeUsd ?? 0;
  if (!Number.isFinite(accessorialTotalUsd) || accessorialTotalUsd < 0)
    return simpleError(
      "accessorialTotalUsd",
      "Accessorial fees must be finite and non-negative.",
      "invalid_fee",
    );
  if (!Number.isFinite(minimumChargeUsd) || minimumChargeUsd < 0)
    return simpleError(
      "minimumChargeUsd",
      "The minimum charge must be finite and non-negative.",
      "invalid_fee",
    );
  const linehaulChargeUsd =
    input.rateUsdPerCwt * (input.chargeableWeightLb / 100);
  const linehaulAfterFloorUsd = Math.max(linehaulChargeUsd, minimumChargeUsd);
  const totalChargeUsd = linehaulAfterFloorUsd + accessorialTotalUsd;
  if (
    !Number.isFinite(linehaulChargeUsd) ||
    linehaulChargeUsd <= 0 ||
    !Number.isFinite(totalChargeUsd)
  )
    return simpleError(
      "rateUsdPerCwt",
      "The LTL charge is outside the representable range.",
      "charge_out_of_range",
    );
  return {
    linehaulChargeUsd,
    linehaulAfterFloorUsd,
    totalChargeUsd,
  };
};

export const ltlRatePerHundredweightExample = {
  input: {
    rateUsdPerCwt: 42,
    chargeableWeightLb: 1150,
    accessorialTotalUsd: 45,
    minimumChargeUsd: 300,
  },
  output: {
    linehaulChargeUsd: 483,
    linehaulAfterFloorUsd: 483,
    totalChargeUsd: 528,
  },
} satisfies ToolExample<
  LtlRatePerHundredweightInput,
  LtlRatePerHundredweightOutput
>;

export const ltlRatePerHundredweightTool = createSimpleTool({
  id: "logistics/ltl-rate-per-hundredweight",
  title: "LTL Rate per Hundredweight Calculator",
  description:
    "Price an LTL shipment as rate-per-cwt times weight over 100 lb, apply the carrier minimum charge to the linehaul and add accessorial fees.",
  inputs: [
    {
      description: "Tariff rate in US dollars per hundredweight (cwt).",
      id: "rateUsdPerCwt",
      kind: "number",
      label: "Rate/cwt",
      minimum: Number.MIN_VALUE,
      unit: "USD/cwt",
    },
    {
      description: "Chargeable weight in pounds.",
      id: "chargeableWeightLb",
      kind: "number",
      label: "Weight",
      minimum: Number.MIN_VALUE,
      unit: "lb",
    },
    {
      default: 0,
      description: "Sum of accessorial fees in US dollars.",
      id: "accessorialTotalUsd",
      kind: "number",
      label: "Accessorials",
      minimum: 0,
    },
    {
      default: 0,
      description:
        "Carrier minimum charge applied to the linehaul before accessorials, in US dollars.",
      id: "minimumChargeUsd",
      kind: "number",
      label: "Minimum charge",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Linehaul charge before the minimum-charge floor, in US dollars.",
      id: "linehaulChargeUsd",
      kind: "number",
      label: "Linehaul",
    },
    {
      description:
        "Linehaul after applying the minimum-charge floor, in US dollars.",
      id: "linehaulAfterFloorUsd",
      kind: "number",
      label: "Linehaul after floor",
    },
    {
      description: "Total charge including accessorial fees, in US dollars.",
      id: "totalChargeUsd",
      kind: "number",
      label: "Total charge",
    },
  ],
  calculate: (input) =>
    calculateLtlRatePerHundredweight({
      accessorialTotalUsd: input.accessorialTotalUsd as number | undefined,
      chargeableWeightLb: input.chargeableWeightLb as number,
      minimumChargeUsd: input.minimumChargeUsd as number | undefined,
      rateUsdPerCwt: input.rateUsdPerCwt as number,
    }),
});

export const runLtlRatePerHundredweight = ltlRatePerHundredweightTool.execute;
export default ltlRatePerHundredweightTool;
