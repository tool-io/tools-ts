import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AssetTurnoverInput = {
  readonly netSales: number;
  readonly averageTotalAssets: number;
};

export type AssetTurnoverOutput = {
  readonly assetTurnover: number;
};

export const assetTurnoverExample = {
  input: { netSales: 120000, averageTotalAssets: 225000 },
  output: { assetTurnover: 0.5333333333333333 },
} satisfies ToolExample<AssetTurnoverInput, AssetTurnoverOutput>;

export const calculateAssetTurnover = (
  input: AssetTurnoverInput,
): AssetTurnoverOutput => {
  if (!Number.isFinite(input.netSales) || input.netSales < 0)
    simpleError(
      "netSales",
      "Net sales must be finite and non-negative.",
      "invalid_net_sales",
    );
  if (!(input.averageTotalAssets > 0))
    simpleError(
      "averageTotalAssets",
      "Average total assets must be greater than zero because the ratio is undefined otherwise.",
      "positive_average_assets_required",
    );
  const assetTurnover = input.netSales / input.averageTotalAssets;
  if (!Number.isFinite(assetTurnover))
    simpleError(
      "averageTotalAssets",
      "Asset turnover exceeds the finite numeric range.",
      "result_not_finite",
    );
  return { assetTurnover };
};

export const assetTurnoverTool = createSimpleTool({
  calculate: (input) =>
    calculateAssetTurnover({
      averageTotalAssets: input.averageTotalAssets as number,
      netSales: input.netSales as number,
    }),
  description:
    "Calculate total asset turnover as net sales divided by average total assets, measuring how efficiently assets generate revenue.",
  id: "accounting/asset-turnover-revenue-over-assets",
  inputs: [
    {
      description:
        "Net sales for the period, after returns, allowances, and discounts.",
      id: "netSales",
      kind: "number",
      label: "Net sales",
      minimum: 0,
    },
    {
      description:
        "Average total assets for the period, for example beginning plus ending divided by two.",
      id: "averageTotalAssets",
      kind: "number",
      label: "Average total assets",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Times per period that assets are turned into net sales; higher values mean more efficient asset use.",
      id: "assetTurnover",
      kind: "number",
      label: "Asset turnover",
    },
  ],
  title: "Asset Turnover Calculator",
});
export const runAssetTurnover = assetTurnoverTool.execute;
export default assetTurnoverTool;
