import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type DataStorageCost = {
  readonly currency: string;
  readonly monthlyTotal: number;
  readonly operationsCost: number;
  readonly retrievalCost: number;
  readonly storageCost: number;
  readonly yearlyTotal: number;
};
export const calculateDataStorageCost = (
  storageGb: number,
  storageRate: number,
  retrievalGb: number,
  retrievalRate: number,
  operations: number,
  operationsRatePerMillion: number,
  currency: string,
): DataStorageCost | null => {
  if (!currency.trim()) return null;
  const storageCost = storageGb * storageRate,
    retrievalCost = retrievalGb * retrievalRate,
    operationsCost = (operations / 1_000_000) * operationsRatePerMillion,
    monthlyTotal = storageCost + retrievalCost + operationsCost;
  return {
    currency,
    monthlyTotal,
    operationsCost,
    retrievalCost,
    storageCost,
    yearlyTotal: monthlyTotal * 12,
  };
};
export const dataStorageCostExample = {
  input: {
    currency: "USD",
    operations: 2_000_000,
    operationsRatePerMillion: 0.4,
    retrievalGb: 100,
    retrievalRate: 0.01,
    storageGb: 1_000,
    storageRate: 0.023,
  },
  output: {
    result: {
      currency: "USD",
      monthlyTotal: 24.8,
      operationsCost: 0.8,
      retrievalCost: 1,
      storageCost: 23,
      yearlyTotal: 297.6,
    },
  },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly operations: number;
    readonly operationsRatePerMillion: number;
    readonly retrievalGb: number;
    readonly retrievalRate: number;
    readonly storageGb: number;
    readonly storageRate: number;
  },
  { readonly result: DataStorageCost }
>;
export const dataStorageCostTool = createSimpleTool({
  id: "cost/data-storage",
  title: "Data Storage Cost Calculator",
  description: "Estimate recurring storage, retrieval, and operation charges.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    { id: "storageGb", kind: "number", label: "Stored data (GB)", minimum: 0 },
    {
      id: "storageRate",
      kind: "number",
      label: "Storage price per GB-month",
      minimum: 0,
    },
    {
      id: "retrievalGb",
      kind: "number",
      label: "Retrieved data (GB)",
      minimum: 0,
    },
    {
      id: "retrievalRate",
      kind: "number",
      label: "Retrieval price per GB",
      minimum: 0,
    },
    { id: "operations", kind: "number", label: "Operations", minimum: 0 },
    {
      id: "operationsRatePerMillion",
      kind: "number",
      label: "Price per million operations",
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "cost/data-storage",
      id: "result",
      kind: "object",
      label: "Storage cost",
    },
  ],
  calculate: (input) => {
    const result = calculateDataStorageCost(
      input.storageGb as number,
      input.storageRate as number,
      input.retrievalGb as number,
      input.retrievalRate as number,
      input.operations as number,
      input.operationsRatePerMillion as number,
      input.currency as string,
    );
    if (!result) return simpleError("currency", "Enter a nonempty currency.");
    return { result };
  },
});
export const runDataStorageCost = dataStorageCostTool.execute;
export default dataStorageCostTool;
