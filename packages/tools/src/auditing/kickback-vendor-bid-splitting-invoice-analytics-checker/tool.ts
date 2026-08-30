import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BidSplittingInput = {
  readonly approvalThreshold: number;
  readonly bidAmounts: ReadonlyArray<number>;
  readonly minimumBidsPerVendor: number;
  readonly vendorKeys: ReadonlyArray<string>;
};

export type BidSplittingOutput = {
  readonly suspiciousGroupCount: number;
  readonly suspiciousVendorKeys: ReadonlyArray<string>;
  readonly suspiciousVendorTotal: number;
};

export const detectBidSplittingAnalytics = (
  input: BidSplittingInput,
): BidSplittingOutput => {
  if (!Number.isFinite(input.approvalThreshold) || input.approvalThreshold <= 0)
    simpleError(
      "approvalThreshold",
      "Approval threshold must be finite and positive.",
      "invalid_approval_threshold",
    );
  if (
    !Number.isSafeInteger(input.minimumBidsPerVendor) ||
    input.minimumBidsPerVendor < 2
  )
    simpleError(
      "minimumBidsPerVendor",
      "Minimum bids per vendor must be a whole number of at least two.",
      "invalid_minimum_bids",
    );
  if (!Array.isArray(input.vendorKeys) || !Array.isArray(input.bidAmounts))
    simpleError(
      "",
      "Vendor keys and bid amounts must be arrays.",
      "bid_data_required",
    );
  if (input.vendorKeys.length !== input.bidAmounts.length)
    simpleError(
      "bidAmounts",
      "Each vendor key must have one bid amount.",
      "bid_data_length_mismatch",
    );
  const groups = new Map<string, number[]>();
  for (const [index, vendorKey] of input.vendorKeys.entries()) {
    const amount = input.bidAmounts[index]!;
    if (typeof vendorKey !== "string" || vendorKey.trim() === "")
      simpleError(
        `vendorKeys.${index}`,
        "Vendor keys must be nonempty strings.",
        "invalid_vendor_key",
      );
    if (!Number.isFinite(amount) || amount <= 0)
      simpleError(
        `bidAmounts.${index}`,
        "Bid amounts must be finite and positive.",
        "invalid_bid_amount",
      );
    const key = vendorKey.trim().toLowerCase();
    const amounts = groups.get(key) ?? [];
    amounts.push(amount);
    groups.set(key, amounts);
  }
  const suspiciousVendorKeys: string[] = [];
  let suspiciousVendorTotal = 0;
  for (const [key, amounts] of groups) {
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    if (
      amounts.length >= input.minimumBidsPerVendor &&
      amounts.every((amount) => amount < input.approvalThreshold) &&
      total >= input.approvalThreshold
    ) {
      suspiciousVendorKeys.push(key);
      suspiciousVendorTotal += total;
      if (!Number.isFinite(suspiciousVendorTotal))
        simpleError(
          "bidAmounts",
          "Suspicious vendor total is not finite.",
          "result_not_finite",
        );
    }
  }
  suspiciousVendorKeys.sort();
  return {
    suspiciousGroupCount: suspiciousVendorKeys.length,
    suspiciousVendorKeys,
    suspiciousVendorTotal,
  };
};

export const bidSplittingExample = {
  input: {
    approvalThreshold: 750_000,
    bidAmounts: [400_000, 380_000, 500_000],
    minimumBidsPerVendor: 2,
    vendorKeys: ["Vendor A", "vendor a", "Vendor B"],
  },
  output: {
    suspiciousGroupCount: 1,
    suspiciousVendorKeys: ["vendor a"],
    suspiciousVendorTotal: 780_000,
  },
} satisfies ToolExample<BidSplittingInput, BidSplittingOutput>;

export const bidSplittingTool = createSimpleTool({
  calculate: (input) =>
    detectBidSplittingAnalytics({
      approvalThreshold: input.approvalThreshold as number,
      bidAmounts: input.bidAmounts as number[],
      minimumBidsPerVendor: input.minimumBidsPerVendor as number,
      vendorKeys: input.vendorKeys as string[],
    }),
  description:
    "Group bid amounts by normalized vendor key and flag groups with enough individually subthreshold bids whose combined value reaches the supplied approval threshold.",
  id: "auditing/kickback-vendor-bid-splitting-invoice-analytics-checker",
  inputs: [
    {
      description: "Approval or review threshold used by the supplied process.",
      id: "approvalThreshold",
      kind: "number",
      label: "Approval threshold",
    },
    {
      description: "Positive bid amount for each vendor-key row.",
      id: "bidAmounts",
      kind: "numberList",
      label: "Bid amounts",
    },
    {
      description: "Minimum number of bids required for a candidate group.",
      id: "minimumBidsPerVendor",
      kind: "integer",
      label: "Minimum bids per vendor",
      minimum: 2,
    },
    {
      description: "Vendor key associated with each bid amount.",
      id: "vendorKeys",
      kind: "stringList",
      label: "Vendor keys",
    },
  ],
  outputs: [
    {
      id: "suspiciousGroupCount",
      kind: "integer",
      label: "Suspicious vendor groups",
      minimum: 0,
    },
    {
      id: "suspiciousVendorKeys",
      kind: "stringList",
      label: "Suspicious vendor keys",
    },
    {
      id: "suspiciousVendorTotal",
      kind: "number",
      label: "Suspicious combined bids",
      minimum: 0,
    },
  ],
  title: "Kickback Vendor Bid Splitting Invoice Analytics Checker",
});

export const runBidSplitting = bidSplittingTool.execute;
export default bidSplittingTool;
