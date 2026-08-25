import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LandedCostDutiesTaxesTotalInput = {
  readonly dutyRatePercent?: number;
  readonly freightCost?: number;
  readonly goodsValue: number;
  readonly insuranceCost?: number;
  readonly otherImportFees?: number;
  readonly vatRatePercent?: number;
};

export type LandedCostDutiesTaxesTotalOutput = {
  readonly customsValueCif: number;
  readonly dutyAmount: number;
  readonly importTaxAmount: number;
  readonly landedCostTotal: number;
};

export const calculateLandedCostDutiesTaxesTotal = (
  input: LandedCostDutiesTaxesTotalInput,
): LandedCostDutiesTaxesTotalOutput => {
  const freightCost = input.freightCost ?? 0;
  const insuranceCost = input.insuranceCost ?? 0;
  const dutyRatePercent = input.dutyRatePercent ?? 0;
  const vatRatePercent = input.vatRatePercent ?? 0;
  const otherImportFees = input.otherImportFees ?? 0;
  for (const [field, value] of [
    ["goodsValue", input.goodsValue],
    ["freightCost", freightCost],
    ["insuranceCost", insuranceCost],
    ["otherImportFees", otherImportFees],
    ["dutyRatePercent", dutyRatePercent],
    ["vatRatePercent", vatRatePercent],
  ] as const) {
    if (!Number.isFinite(value) || value < 0)
      return simpleError(
        field,
        "Amounts and rates must be finite and non-negative.",
        "invalid_value",
      );
  }
  const customsValueCif = input.goodsValue + freightCost + insuranceCost;
  const dutyAmount = customsValueCif * (dutyRatePercent / 100);
  if (customsValueCif > 0 && dutyRatePercent > 0 && dutyAmount === 0)
    return simpleError(
      "dutyRatePercent",
      "The duty amount is below the representable range.",
      "cost_out_of_range",
    );
  const importTaxBase = customsValueCif + dutyAmount;
  const importTaxAmount = importTaxBase * (vatRatePercent / 100);
  if (importTaxBase > 0 && vatRatePercent > 0 && importTaxAmount === 0)
    return simpleError(
      "vatRatePercent",
      "The import tax amount is below the representable range.",
      "cost_out_of_range",
    );
  const landedCostTotal = importTaxBase + importTaxAmount + otherImportFees;
  if (
    ![customsValueCif, dutyAmount, importTaxAmount, landedCostTotal].every(
      Number.isFinite,
    )
  )
    return simpleError(
      "goodsValue",
      "The landed-cost result is outside the representable range.",
      "cost_out_of_range",
    );
  return {
    customsValueCif,
    dutyAmount,
    importTaxAmount,
    landedCostTotal,
  };
};

export const landedCostDutiesTaxesTotalExample = {
  input: {
    dutyRatePercent: 6,
    freightCost: 400,
    goodsValue: 10000,
    insuranceCost: 100,
    otherImportFees: 75,
    vatRatePercent: 21,
  },
  output: {
    customsValueCif: 10500,
    dutyAmount: 630,
    importTaxAmount: 2337.2999999999997,
    landedCostTotal: 13542.3,
  },
} satisfies ToolExample<
  LandedCostDutiesTaxesTotalInput,
  LandedCostDutiesTaxesTotalOutput
>;

export const landedCostDutiesTaxesTotalTool = createSimpleTool({
  id: "logistics/landed-cost-duties-taxes-total",
  title: "Landed Cost Duties and Taxes Total",
  description:
    "Estimate landed cost with a supplied CIF-style model: goods plus freight and insurance, duty on that customs value, tax on customs value plus duty, and separate import fees. Confirm the actual valuation and tax bases for the destination jurisdiction.",
  inputs: [
    {
      default: 0,
      description: "Ad-valorem duty rate in percent applied to CIF value.",
      id: "dutyRatePercent",
      kind: "number",
      label: "Duty rate",
      minimum: 0,
    },
    {
      default: 0,
      description: "International freight cost in currency units.",
      id: "freightCost",
      kind: "number",
      label: "Freight",
      minimum: 0,
    },
    {
      description: "Goods value in currency units.",
      id: "goodsValue",
      kind: "number",
      label: "Goods value",
      minimum: 0,
    },
    {
      default: 0,
      description: "Marine insurance cost in currency units.",
      id: "insuranceCost",
      kind: "number",
      label: "Insurance",
      minimum: 0,
    },
    {
      default: 0,
      description: "Brokerage, port and handling fees added outside tax bases.",
      id: "otherImportFees",
      kind: "number",
      label: "Other fees",
      minimum: 0,
    },
    {
      default: 0,
      description: "Import VAT/GST rate in percent applied to CIF plus duty.",
      id: "vatRatePercent",
      kind: "number",
      label: "VAT rate",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Customs value (goods + freight + insurance).",
      id: "customsValueCif",
      kind: "number",
      label: "CIF value",
    },
    {
      description: "Duty amount in currency units.",
      id: "dutyAmount",
      kind: "number",
      label: "Duty",
    },
    {
      description: "Import VAT/GST amount in currency units.",
      id: "importTaxAmount",
      kind: "number",
      label: "Import tax",
    },
    {
      description: "Full landed cost including fees in currency units.",
      id: "landedCostTotal",
      kind: "number",
      label: "Landed total",
    },
  ],
  calculate: (input) =>
    calculateLandedCostDutiesTaxesTotal({
      dutyRatePercent: input.dutyRatePercent as number | undefined,
      freightCost: input.freightCost as number | undefined,
      goodsValue: input.goodsValue as number,
      insuranceCost: input.insuranceCost as number | undefined,
      otherImportFees: input.otherImportFees as number | undefined,
      vatRatePercent: input.vatRatePercent as number | undefined,
    }),
});

export const runLandedCostDutiesTaxesTotal =
  landedCostDutiesTaxesTotalTool.execute;
export default landedCostDutiesTaxesTotalTool;
