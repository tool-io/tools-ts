import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AllowanceDoubtfulInput = {
  readonly accountsReceivable: number;
  readonly estimatedUncollectiblePercent: number;
};

export type AllowanceDoubtfulOutput = {
  readonly estimatedUncollectibleAmount: number;
};

export const allowanceDoubtfulExample = {
  input: { accountsReceivable: 745000, estimatedUncollectiblePercent: 8 },
  output: { estimatedUncollectibleAmount: 59600 },
} satisfies ToolExample<AllowanceDoubtfulInput, AllowanceDoubtfulOutput>;

export const calculateAllowanceDoubtful = (
  input: AllowanceDoubtfulInput,
): AllowanceDoubtfulOutput => {
  if (
    !Number.isFinite(input.accountsReceivable) ||
    input.accountsReceivable < 0
  )
    simpleError(
      "accountsReceivable",
      "Accounts receivable must be a finite non-negative number.",
      "invalid_accounts_receivable",
    );
  if (
    !Number.isFinite(input.estimatedUncollectiblePercent) ||
    input.estimatedUncollectiblePercent < 0 ||
    input.estimatedUncollectiblePercent > 100
  )
    simpleError(
      "estimatedUncollectiblePercent",
      "The estimated uncollectible percentage must be between 0 and 100.",
      "invalid_uncollectible_percent",
    );
  const amount =
    input.accountsReceivable * (input.estimatedUncollectiblePercent / 100);
  return { estimatedUncollectibleAmount: amount === 0 ? 0 : amount };
};

export const allowanceDoubtfulTool = createSimpleTool({
  calculate: (input) =>
    calculateAllowanceDoubtful({
      accountsReceivable: input.accountsReceivable as number,
      estimatedUncollectiblePercent:
        input.estimatedUncollectiblePercent as number,
    }),
  description:
    "Estimate the allowance for doubtful accounts from accounts receivable using a percentage of the receivable balance on a 0-100 scale.",
  id: "accounting/allowance-doubtful-accounts-percent-of-ar",
  inputs: [
    {
      description: "Ending accounts receivable balance for the period.",
      id: "accountsReceivable",
      kind: "number",
      label: "Accounts receivable",
      minimum: 0,
    },
    {
      description:
        "Estimated uncollectible share of receivables on a 0-100 percentage scale.",
      id: "estimatedUncollectiblePercent",
      kind: "number",
      label: "Estimated uncollectible percent",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Target allowance for doubtful accounts balance after the adjusting entry.",
      id: "estimatedUncollectibleAmount",
      kind: "number",
      label: "Estimated uncollectible amount",
    },
  ],
  title: "Allowance for Doubtful Accounts Calculator",
});
export const runAllowanceDoubtful = allowanceDoubtfulTool.execute;
export default allowanceDoubtfulTool;
