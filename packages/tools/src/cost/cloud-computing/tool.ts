import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type CloudComputingCost = {
  readonly computeCost: number;
  readonly currency: string;
  readonly egressCost: number;
  readonly monthlyTotal: number;
  readonly storageCost: number;
  readonly yearlyTotal: number;
};
export const calculateCloudComputingCost = (
  instanceRate: number,
  hours: number,
  instances: number,
  storageGb: number,
  storageRate: number,
  egressGb: number,
  egressRate: number,
  currency: string,
): CloudComputingCost | null => {
  if (!currency.trim() || instances <= 0) return null;
  const computeCost = instanceRate * hours * instances,
    storageCost = storageGb * storageRate,
    egressCost = egressGb * egressRate,
    monthlyTotal = computeCost + storageCost + egressCost;
  return {
    computeCost,
    currency,
    egressCost,
    monthlyTotal,
    storageCost,
    yearlyTotal: Number((monthlyTotal * 12).toPrecision(12)),
  };
};
export const cloudComputingCostExample = {
  input: {
    currency: "USD",
    egressGb: 50,
    egressRate: 0.09,
    hours: 730,
    instanceRate: 0.05,
    instances: 1,
    storageGb: 100,
    storageRate: 0.023,
  },
  output: {
    result: {
      computeCost: 36.5,
      currency: "USD",
      egressCost: 4.5,
      monthlyTotal: 43.3,
      storageCost: 2.3,
      yearlyTotal: 519.6,
    },
  },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly egressGb: number;
    readonly egressRate: number;
    readonly hours: number;
    readonly instanceRate: number;
    readonly instances: number;
    readonly storageGb: number;
    readonly storageRate: number;
  },
  { readonly result: CloudComputingCost }
>;
export const cloudComputingCostTool = createSimpleTool({
  id: "cost/cloud-computing",
  title: "Cloud Computing Cost Calculator",
  description:
    "Estimate monthly and yearly compute, storage, and outbound-transfer costs.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    {
      id: "instanceRate",
      kind: "number",
      label: "Instance price per hour",
      minimum: 0,
    },
    { id: "hours", kind: "number", label: "Instance hours", minimum: 0 },
    {
      id: "instances",
      kind: "number",
      label: "Instances",
      minimum: Number.MIN_VALUE,
    },
    { id: "storageGb", kind: "number", label: "Storage (GB)", minimum: 0 },
    {
      id: "storageRate",
      kind: "number",
      label: "Storage price per GB",
      minimum: 0,
    },
    {
      id: "egressGb",
      kind: "number",
      label: "Outbound transfer (GB)",
      minimum: 0,
    },
    {
      id: "egressRate",
      kind: "number",
      label: "Transfer price per GB",
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "cost/cloud-computing",
      id: "result",
      kind: "object",
      label: "Cloud cost",
    },
  ],
  calculate: (input) => {
    const result = calculateCloudComputingCost(
      input.instanceRate as number,
      input.hours as number,
      input.instances as number,
      input.storageGb as number,
      input.storageRate as number,
      input.egressGb as number,
      input.egressRate as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "instances",
        "Instance count must be positive and currency nonempty.",
      );
    return { result };
  },
});
export const runCloudComputingCost = cloudComputingCostTool.execute;
export default cloudComputingCostTool;
