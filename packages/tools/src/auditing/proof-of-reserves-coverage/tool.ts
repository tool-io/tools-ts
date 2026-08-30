import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly verifiedReserveAssets: number;
  readonly reportedCustomerLiabilities: number;
  readonly includedCustomerAccounts: number;
  readonly totalCustomerAccounts: number;
  readonly minimumReserveRatio: number;
}>;
export type Output = Readonly<{
  readonly reserveRatio: number;
  readonly accountInclusionPercent: number;
  readonly reserveSurplus: number;
  readonly meetsReserveRatio: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.reportedCustomerLiabilities <= 0 ||
    input.totalCustomerAccounts <= 0 ||
    input.includedCustomerAccounts > input.totalCustomerAccounts
  )
    simpleError(
      "reportedCustomerLiabilities",
      "Liabilities and account total must be positive and inclusion valid.",
      "invalid_totals",
    );
  const reserveRatio =
    input.verifiedReserveAssets / input.reportedCustomerLiabilities;
  return {
    reserveRatio,
    accountInclusionPercent:
      (input.includedCustomerAccounts / input.totalCustomerAccounts) * 100,
    reserveSurplus:
      input.verifiedReserveAssets - input.reportedCustomerLiabilities,
    meetsReserveRatio: reserveRatio >= input.minimumReserveRatio,
  };
};

export const exampleInput = {
  verifiedReserveAssets: 1100,
  reportedCustomerLiabilities: 1000,
  includedCustomerAccounts: 95,
  totalCustomerAccounts: 100,
  minimumReserveRatio: 1,
} satisfies Input;
export const exampleOutput = {
  reserveRatio: 1.1,
  accountInclusionPercent: 95,
  reserveSurplus: 100,
  meetsReserveRatio: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      verifiedReserveAssets: input.verifiedReserveAssets as number,
      reportedCustomerLiabilities: input.reportedCustomerLiabilities as number,
      includedCustomerAccounts: input.includedCustomerAccounts as number,
      totalCustomerAccounts: input.totalCustomerAccounts as number,
      minimumReserveRatio: input.minimumReserveRatio as number,
    }),
  description:
    "Measure proof-of-reserves asset ratio and customer-account inclusion.",
  id: "auditing/proof-of-reserves-coverage",
  inputs: [
    {
      id: "verifiedReserveAssets",
      label: "Verified reserve assets",
      kind: "number",
      minimum: 0,
    },
    {
      id: "reportedCustomerLiabilities",
      label: "Reported customer liabilities",
      kind: "number",
      minimum: 0,
    },
    {
      id: "includedCustomerAccounts",
      label: "Included customer accounts",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "totalCustomerAccounts",
      label: "Total customer accounts",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "minimumReserveRatio",
      label: "Minimum reserve ratio",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "reserveRatio",
      label: "Reserve asset-to-liability ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "accountInclusionPercent",
      label: "Customer account inclusion",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "reserveSurplus", label: "Reserve surplus", kind: "number" },
    {
      id: "meetsReserveRatio",
      label: "Meets supplied reserve ratio",
      kind: "boolean",
    },
  ],
  title: "Proof-of-Reserves Coverage",
});

export const run = tool.execute;
export default tool;
