import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApicIssuanceInput = {
  readonly issuePricePerShare: number;
  readonly parValuePerShare: number;
  readonly sharesIssued: number;
};

export type ApicIssuanceOutput = {
  readonly additionalPaidInCapital: number;
  readonly commonStockAtPar: number;
  readonly totalProceeds: number;
};

export const apicIssuanceExample = {
  input: { issuePricePerShare: 20, parValuePerShare: 5, sharesIssued: 10000 },
  output: {
    additionalPaidInCapital: 150000,
    commonStockAtPar: 50000,
    totalProceeds: 200000,
  },
} satisfies ToolExample<ApicIssuanceInput, ApicIssuanceOutput>;

export const calculateApicIssuance = (
  input: ApicIssuanceInput,
): ApicIssuanceOutput => {
  if (!Number.isSafeInteger(input.sharesIssued) || input.sharesIssued < 0)
    simpleError(
      "sharesIssued",
      "Shares issued must be a non-negative whole number.",
      "invalid_shares_issued",
    );
  if (!Number.isFinite(input.parValuePerShare) || input.parValuePerShare < 0)
    simpleError(
      "parValuePerShare",
      "Par value per share must be a finite non-negative number.",
      "invalid_par_value",
    );
  if (
    !Number.isFinite(input.issuePricePerShare) ||
    input.issuePricePerShare < 0
  )
    simpleError(
      "issuePricePerShare",
      "Issue price per share must be a finite non-negative number.",
      "invalid_issue_price",
    );
  if (
    input.sharesIssued > 0 &&
    input.issuePricePerShare < input.parValuePerShare
  )
    simpleError(
      "issuePricePerShare",
      "Issue price must not be below par for this excess-over-par calculation.",
      "issue_price_below_par",
    );
  const commonStockAtPar = input.sharesIssued * input.parValuePerShare;
  const totalProceeds = input.sharesIssued * input.issuePricePerShare;
  const additionalPaidInCapital = totalProceeds - commonStockAtPar;
  if (
    !Number.isFinite(commonStockAtPar) ||
    !Number.isFinite(totalProceeds) ||
    !Number.isFinite(additionalPaidInCapital)
  )
    simpleError(
      "sharesIssued",
      "The issuance amounts are outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    additionalPaidInCapital:
      additionalPaidInCapital === 0 ? 0 : additionalPaidInCapital,
    commonStockAtPar: commonStockAtPar === 0 ? 0 : commonStockAtPar,
    totalProceeds: totalProceeds === 0 ? 0 : totalProceeds,
  };
};

export const apicIssuanceTool = createSimpleTool({
  calculate: (input) =>
    calculateApicIssuance({
      issuePricePerShare: input.issuePricePerShare as number,
      parValuePerShare: input.parValuePerShare as number,
      sharesIssued: input.sharesIssued as number,
    }),
  description:
    "Split share issuance proceeds between common stock at par and additional paid-in capital for the excess over par.",
  id: "accounting/apic-excess-par-share-issuance-computation",
  inputs: [
    {
      description: "Number of shares issued in the transaction.",
      id: "sharesIssued",
      kind: "integer",
      label: "Shares issued",
      minimum: 0,
    },
    {
      description: "Stated par or stated value per share.",
      id: "parValuePerShare",
      kind: "number",
      label: "Par value per share",
      minimum: 0,
    },
    {
      description: "Issue price per share actually received.",
      id: "issuePricePerShare",
      kind: "number",
      label: "Issue price per share",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Common stock credited at shares issued times par value.",
      id: "commonStockAtPar",
      kind: "number",
      label: "Common stock at par",
    },
    {
      description:
        "Additional paid-in capital, the excess of proceeds over the par amount.",
      id: "additionalPaidInCapital",
      kind: "number",
      label: "Additional paid-in capital",
    },
    {
      description: "Total cash or consideration received for the issuance.",
      id: "totalProceeds",
      kind: "number",
      label: "Total proceeds",
    },
  ],
  title: "APIC Excess Par Issuance Calculator",
});
export const runApicIssuance = apicIssuanceTool.execute;
export default apicIssuanceTool;
