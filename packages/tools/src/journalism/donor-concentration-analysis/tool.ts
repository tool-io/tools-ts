import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly donorIds: readonly string[];
  readonly contributionAmounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalContributions: number;
  readonly largestDonorSharePercent: number;
  readonly herfindahlIndex: number;
  readonly uniqueDonorCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.donorIds.length === 0 ||
    input.donorIds.length !== input.contributionAmounts.length
  )
    simpleError(
      "donorIds",
      "Donor and amount lists must be nonempty and equal length.",
      "length_mismatch",
    );
  if (input.contributionAmounts.some((value) => value < 0))
    simpleError(
      "contributionAmounts",
      "Contribution amounts must be nonnegative.",
      "negative_amount",
    );
  const totals = new Map<string, number>();
  input.donorIds.forEach((id, index) => {
    const key = id.trim();
    if (!key)
      simpleError("donorIds", "Donor IDs must not be empty.", "empty_donor");
    totals.set(key, (totals.get(key) ?? 0) + input.contributionAmounts[index]);
  });
  const totalContributions = [...totals.values()].reduce((a, b) => a + b, 0);
  if (totalContributions === 0)
    return {
      totalContributions,
      largestDonorSharePercent: 0,
      herfindahlIndex: 0,
      uniqueDonorCount: totals.size,
    };
  const shares = [...totals.values()].map(
    (value) => value / totalContributions,
  );
  return {
    totalContributions,
    largestDonorSharePercent: Math.max(...shares) * 100,
    herfindahlIndex: shares.reduce((sum, value) => sum + value * value, 0),
    uniqueDonorCount: totals.size,
  };
};

export const exampleInput = {
  donorIds: ["A", "B", "A"],
  contributionAmounts: [60, 30, 10],
} satisfies Input;
export const exampleOutput = {
  totalContributions: 100,
  largestDonorSharePercent: 70,
  herfindahlIndex: 0.58,
  uniqueDonorCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      donorIds: input.donorIds as readonly string[],
      contributionAmounts: input.contributionAmounts as readonly number[],
    }),
  description:
    "Aggregate contributions by donor and calculate largest-share and Herfindahl concentration measures.",
  id: "journalism/donor-concentration-analysis",
  inputs: [
    { id: "donorIds", label: "Donor IDs", kind: "stringList" },
    {
      id: "contributionAmounts",
      label: "Contribution amounts",
      kind: "numberList",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "totalContributions",
      label: "Total contributions",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "largestDonorSharePercent",
      label: "Largest donor share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "herfindahlIndex",
      label: "Donor concentration index",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "uniqueDonorCount",
      label: "Unique donor count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Donor Concentration Analysis",
});

export const run = tool.execute;
export default tool;
