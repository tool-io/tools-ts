import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScheduleFootSampleInput = {
  readonly ledgerTotal: number;
  readonly sampledBalances: ReadonlyArray<number>;
  readonly sampledFootTotal: number;
  readonly tolerance: number;
};

export type ScheduleFootSampleOutput = {
  readonly footDifference: number;
  readonly ledgerDifference: number;
  readonly reconciled: boolean;
  readonly sampledBalanceSum: number;
};

export const sampleScheduleFootTie = (
  input: ScheduleFootSampleInput,
): ScheduleFootSampleOutput => {
  if (
    !Array.isArray(input.sampledBalances) ||
    input.sampledBalances.length === 0
  )
    simpleError(
      "sampledBalances",
      "At least one sampled balance is required.",
      "sampled_balances_required",
    );
  let sampledBalanceSum = 0;
  for (const [index, balance] of input.sampledBalances.entries()) {
    if (!Number.isFinite(balance))
      simpleError(
        `sampledBalances.${index}`,
        "Sampled balances must be finite.",
        "invalid_sampled_balance",
      );
    const nextSum = sampledBalanceSum + balance;
    if (!Number.isFinite(nextSum))
      simpleError(
        `sampledBalances.${index}`,
        "The sampled balance sum is not finite.",
        "result_not_finite",
      );
    sampledBalanceSum = nextSum;
  }
  for (const [field, value] of [
    ["ledgerTotal", input.ledgerTotal],
    ["sampledFootTotal", input.sampledFootTotal],
  ] as const)
    if (!Number.isFinite(value))
      simpleError(field, `${field} must be finite.`, "finite_total_required");
  if (!Number.isFinite(input.tolerance) || input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be finite and nonnegative.",
      "invalid_tolerance",
    );
  const footDifference = input.sampledFootTotal - sampledBalanceSum;
  const ledgerDifference = sampledBalanceSum - input.ledgerTotal;
  if (!Number.isFinite(footDifference) || !Number.isFinite(ledgerDifference))
    simpleError(
      "sampledFootTotal",
      "The foot-tie differences are not finite.",
      "result_not_finite",
    );
  return {
    footDifference: footDifference === 0 ? 0 : footDifference,
    ledgerDifference: ledgerDifference === 0 ? 0 : ledgerDifference,
    reconciled:
      Math.abs(footDifference) <= input.tolerance &&
      Math.abs(ledgerDifference) <= input.tolerance,
    sampledBalanceSum,
  };
};

export const scheduleFootSampleExample = {
  input: {
    ledgerTotal: 1_000_000,
    sampledBalances: [250_000, 300_000, 450_000],
    sampledFootTotal: 1_000_000,
    tolerance: 100,
  },
  output: {
    footDifference: 0,
    ledgerDifference: 0,
    reconciled: true,
    sampledBalanceSum: 1_000_000,
  },
} satisfies ToolExample<ScheduleFootSampleInput, ScheduleFootSampleOutput>;

export const scheduleFootSampleTool = createSimpleTool({
  calculate: (input) =>
    sampleScheduleFootTie({
      ledgerTotal: input.ledgerTotal as number,
      sampledBalances: input.sampledBalances as number[],
      sampledFootTotal: input.sampledFootTotal as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Sum selected client-schedule balances and compare the sum with the stated foot total and ledger total against an explicit tolerance.",
  id: "auditing/client-provided-schedule-reliability-foot-tie-sampler",
  inputs: [
    { id: "ledgerTotal", kind: "number", label: "Ledger total" },
    {
      description: "Finite balances selected for the foot test.",
      id: "sampledBalances",
      kind: "numberList",
      label: "Sampled balances",
    },
    {
      description: "Total stated on the client-provided schedule.",
      id: "sampledFootTotal",
      kind: "number",
      label: "Sampled foot total",
    },
    { id: "tolerance", kind: "number", label: "Tolerance", minimum: 0 },
  ],
  outputs: [
    { id: "footDifference", kind: "number", label: "Foot minus balance sum" },
    {
      id: "ledgerDifference",
      kind: "number",
      label: "Balance sum minus ledger",
    },
    { id: "reconciled", kind: "boolean", label: "Schedule foot reconciled" },
    {
      id: "sampledBalanceSum",
      kind: "number",
      label: "Sampled balance sum",
    },
  ],
  title: "Client Provided Schedule Reliability Foot-Tie Sampler",
});

export const runScheduleFootSample = scheduleFootSampleTool.execute;
export default scheduleFootSampleTool;
