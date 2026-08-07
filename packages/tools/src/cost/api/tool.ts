import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type ApiCost = {
  readonly billableRequests: number;
  readonly currency: string;
  readonly monthlyTotal: number;
  readonly requestCost: number;
  readonly transferCost: number;
};
export const calculateApiCost = (
  requests: number,
  includedRequests: number,
  requestRatePerMillion: number,
  transferGb: number,
  transferRatePerGb: number,
  currency: string,
): ApiCost | null => {
  if (!currency.trim()) return null;
  const billableRequests = Math.max(0, requests - includedRequests),
    requestCost = (billableRequests / 1_000_000) * requestRatePerMillion,
    transferCost = transferGb * transferRatePerGb;
  return {
    billableRequests,
    currency,
    monthlyTotal: requestCost + transferCost,
    requestCost,
    transferCost,
  };
};
export const apiCostExample = {
  input: {
    currency: "USD",
    includedRequests: 1_000_000,
    requestRatePerMillion: 1,
    requests: 5_000_000,
    transferGb: 100,
    transferRatePerGb: 0.09,
  },
  output: {
    result: {
      billableRequests: 4_000_000,
      currency: "USD",
      monthlyTotal: 13,
      requestCost: 4,
      transferCost: 9,
    },
  },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly includedRequests: number;
    readonly requestRatePerMillion: number;
    readonly requests: number;
    readonly transferGb: number;
    readonly transferRatePerGb: number;
  },
  { readonly result: ApiCost }
>;
export const apiCostTool = createSimpleTool({
  id: "cost/api",
  title: "API Cost Calculator",
  description:
    "Estimate API request and data-transfer charges after an included allowance.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    { id: "requests", kind: "number", label: "Monthly requests", minimum: 0 },
    {
      id: "includedRequests",
      kind: "number",
      label: "Included requests",
      minimum: 0,
    },
    {
      id: "requestRatePerMillion",
      kind: "number",
      label: "Price per million requests",
      minimum: 0,
    },
    {
      id: "transferGb",
      kind: "number",
      label: "Data transfer (GB)",
      minimum: 0,
    },
    {
      id: "transferRatePerGb",
      kind: "number",
      label: "Price per GB",
      minimum: 0,
    },
  ],
  outputs: [
    { format: "cost/api", id: "result", kind: "object", label: "API cost" },
  ],
  calculate: (input) => {
    const result = calculateApiCost(
      input.requests as number,
      input.includedRequests as number,
      input.requestRatePerMillion as number,
      input.transferGb as number,
      input.transferRatePerGb as number,
      input.currency as string,
    );
    if (!result) return simpleError("currency", "Enter a nonempty currency.");
    return { result };
  },
});
export const runApiCost = apiCostTool.execute;
export default apiCostTool;
