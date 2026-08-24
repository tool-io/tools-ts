import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EmailMessageCountSummatorInput = {
  readonly messageCounts: readonly number[];
};

export type EmailMessageCountSummatorOutput = {
  readonly accountCount: number;
  readonly totalMessages: number;
  readonly averagePerAccount: number;
};

export const calculateEmailMessageCountSummator = (
  input: EmailMessageCountSummatorInput,
): EmailMessageCountSummatorOutput => {
  const counts = input.messageCounts;
  if (!Array.isArray(counts) || counts.length === 0)
    simpleError(
      "messageCounts",
      "At least one account message count is required.",
      "invalid_counts",
    );
  for (let i = 0; i < counts.length; i += 1) {
    const c = (counts as readonly number[])[i] as number;
    if (!Number.isSafeInteger(c) || c < 0)
      simpleError(
        "messageCounts",
        "Account message counts must be non-negative safe integers.",
        "invalid_counts",
      );
  }
  let totalMessages = 0;
  for (const c of counts as readonly number[]) totalMessages += c;
  if (!Number.isSafeInteger(totalMessages))
    simpleError(
      "messageCounts",
      "Total message count exceeds the exact safe-integer range.",
      "numeric_overflow",
    );
  const averagePerAccount = totalMessages / counts.length;
  if (!Number.isFinite(averagePerAccount))
    simpleError(
      "messageCounts",
      "Average could not be calculated.",
      "numeric_overflow",
    );
  return {
    accountCount: counts.length,
    totalMessages: totalMessages === 0 ? 0 : totalMessages,
    averagePerAccount: averagePerAccount === 0 ? 0 : averagePerAccount,
  };
};

export const emailMessageCountSummatorExample = {
  input: { messageCounts: [120, 340, 58] },
  output: {
    accountCount: 3,
    totalMessages: 518,
    averagePerAccount: 172.66666666666666,
  },
} satisfies ToolExample<
  EmailMessageCountSummatorInput,
  EmailMessageCountSummatorOutput
>;

export const emailMessageCountSummatorTool = createSimpleTool({
  id: "archival-studies/email-message-count-summator",
  title: "Email Archive Message Count per Account Summator",
  description:
    "Sum per-account email message counts across an archived mailbox corpus and report the account total and mean messages per account.",
  inputs: [
    {
      description: "Message counts for each archived account.",
      id: "messageCounts",
      kind: "numberList",
      label: "Message counts",
    },
  ],
  outputs: [
    {
      description: "Number of accounts aggregated.",
      id: "accountCount",
      kind: "integer",
      label: "Accounts",
    },
    {
      description: "Total messages across all accounts.",
      id: "totalMessages",
      kind: "integer",
      label: "Total messages",
    },
    {
      description: "Mean message count per account.",
      id: "averagePerAccount",
      kind: "number",
      label: "Average per account",
    },
  ],
  calculate: (input) =>
    calculateEmailMessageCountSummator({
      messageCounts: input.messageCounts as readonly number[],
    }),
});

export const runEmailMessageCountSummator =
  emailMessageCountSummatorTool.execute;
export default emailMessageCountSummatorTool;
