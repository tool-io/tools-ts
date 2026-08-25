import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CustomsBrokerFeePerEntryLookupInput = {
  readonly benchmarkFeePerEntry?: number;
  readonly entryCount: number;
  readonly minimumFeePerEntry?: number;
  readonly totalBrokerageSpend: number;
};

export type CustomsBrokerFeePerEntryLookupOutput = {
  readonly averageFeePerEntry: number;
  readonly benchmarkVariancePercent: number;
  readonly effectiveFeePerEntry: number;
};

export const calculateCustomsBrokerFeePerEntryLookup = (
  input: CustomsBrokerFeePerEntryLookupInput,
): CustomsBrokerFeePerEntryLookupOutput => {
  if (!(Number.isSafeInteger(input.entryCount) && input.entryCount > 0))
    return simpleError(
      "entryCount",
      "Entry count must be greater than zero.",
      "invalid_entries",
    );
  const benchmarkFeePerEntry = input.benchmarkFeePerEntry ?? 150;
  const minimumFeePerEntry = input.minimumFeePerEntry ?? 0;
  if (!Number.isFinite(benchmarkFeePerEntry) || benchmarkFeePerEntry <= 0)
    return simpleError(
      "benchmarkFeePerEntry",
      "The benchmark fee must be finite and greater than zero.",
      "invalid_benchmark",
    );
  if (!Number.isFinite(minimumFeePerEntry) || minimumFeePerEntry < 0)
    return simpleError(
      "minimumFeePerEntry",
      "The minimum fee must be finite and non-negative.",
      "invalid_fee",
    );
  if (
    !Number.isFinite(input.totalBrokerageSpend) ||
    input.totalBrokerageSpend < 0
  )
    return simpleError(
      "totalBrokerageSpend",
      "Total brokerage spend must be finite and non-negative.",
      "invalid_spend",
    );
  const averageFeePerEntry = input.totalBrokerageSpend / input.entryCount;
  const benchmarkVariancePercent =
    ((averageFeePerEntry - benchmarkFeePerEntry) / benchmarkFeePerEntry) * 100;
  if (
    !Number.isFinite(averageFeePerEntry) ||
    !Number.isFinite(benchmarkVariancePercent)
  )
    return simpleError(
      "totalBrokerageSpend",
      "The per-entry comparison is outside the representable range.",
      "fee_out_of_range",
    );
  return {
    averageFeePerEntry,
    benchmarkVariancePercent,
    effectiveFeePerEntry: Math.max(averageFeePerEntry, minimumFeePerEntry),
  };
};

export const customsBrokerFeePerEntryLookupExample = {
  input: {
    benchmarkFeePerEntry: 150,
    entryCount: 12,
    minimumFeePerEntry: 0,
    totalBrokerageSpend: 1875,
  },
  output: {
    averageFeePerEntry: 156.25,
    benchmarkVariancePercent: 4.166666666666666,
    effectiveFeePerEntry: 156.25,
  },
} satisfies ToolExample<
  CustomsBrokerFeePerEntryLookupInput,
  CustomsBrokerFeePerEntryLookupOutput
>;

export const customsBrokerFeePerEntryLookupTool = createSimpleTool({
  id: "logistics/customs-broker-fee-per-entry-lookup",
  title: "Customs Broker Fee per Entry Lookup",
  description:
    "Average brokerage spend per customs entry, apply any contractual per-entry minimum, and compare against an indicative benchmark fee that should be overridden with your quoted rate.",
  inputs: [
    {
      default: 150,
      description:
        "Indicative planning benchmark fee per entry in currency units; override with your quote.",
      id: "benchmarkFeePerEntry",
      kind: "number",
      label: "Benchmark fee",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Number of customs entries in the period.",
      id: "entryCount",
      kind: "integer",
      label: "Entries",
      minimum: 1,
    },
    {
      default: 0,
      description: "Contractual minimum fee charged per entry.",
      id: "minimumFeePerEntry",
      kind: "number",
      label: "Minimum fee",
      minimum: 0,
    },
    {
      description: "Total brokerage spend in currency units.",
      id: "totalBrokerageSpend",
      kind: "number",
      label: "Total spend",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total brokerage spend divided by entries.",
      id: "averageFeePerEntry",
      kind: "number",
      label: "Average fee",
      minimum: 0,
    },
    {
      description: "Average fee versus benchmark fee in percent.",
      id: "benchmarkVariancePercent",
      kind: "number",
      label: "Benchmark variance",
      unit: "%",
    },
    {
      description: "Average fee raised to any contractual per-entry minimum.",
      id: "effectiveFeePerEntry",
      kind: "number",
      label: "Effective fee",
      minimum: 0,
    },
  ],
  calculate: (input) =>
    calculateCustomsBrokerFeePerEntryLookup({
      benchmarkFeePerEntry: input.benchmarkFeePerEntry as number | undefined,
      entryCount: input.entryCount as number,
      minimumFeePerEntry: input.minimumFeePerEntry as number | undefined,
      totalBrokerageSpend: input.totalBrokerageSpend as number,
    }),
});

export const runCustomsBrokerFeePerEntryLookup =
  customsBrokerFeePerEntryLookupTool.execute;
export default customsBrokerFeePerEntryLookupTool;
