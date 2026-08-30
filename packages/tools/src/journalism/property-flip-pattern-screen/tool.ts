import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly transferDates: readonly string[];
  readonly salePrices: readonly number[];
  readonly maximumHoldingDays: number;
  readonly minimumGainPercent: number;
}>;
export type Output = Readonly<{
  readonly candidatePairs: readonly string[];
  readonly candidateCount: number;
  readonly largestGainPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.transferDates.length < 2 ||
    input.transferDates.length !== input.salePrices.length
  )
    simpleError(
      "transferDates",
      "Dates and prices must contain at least two aligned entries.",
      "length_mismatch",
    );
  const rows = input.transferDates
    .map((date, index) => {
      const time = Date.parse(`${date}T00:00:00Z`);
      if (Number.isNaN(time) || input.salePrices[index] <= 0)
        simpleError(
          "transferDates",
          "Dates must be ISO dates and prices must be positive.",
          "invalid_transfer",
        );
      return { date, time, price: input.salePrices[index], index };
    })
    .sort((a, b) => a.time - b.time);
  const candidatePairs: string[] = [];
  let largestGainPercent = -Infinity;
  for (let i = 1; i < rows.length; i += 1) {
    const days = (rows[i].time - rows[i - 1].time) / 86400000;
    const gain = (rows[i].price / rows[i - 1].price - 1) * 100;
    largestGainPercent = Math.max(largestGainPercent, gain);
    if (days <= input.maximumHoldingDays && gain >= input.minimumGainPercent)
      candidatePairs.push(`${rows[i - 1].index}->${rows[i].index}`);
  }
  return {
    candidatePairs,
    candidateCount: candidatePairs.length,
    largestGainPercent,
  };
};

export const exampleInput = {
  transferDates: ["2024-01-01", "2024-05-01", "2025-01-01"],
  salePrices: [100000, 140000, 145000],
  maximumHoldingDays: 180,
  minimumGainPercent: 25,
} satisfies Input;
export const exampleOutput = {
  candidatePairs: ["0->1"],
  candidateCount: 1,
  largestGainPercent: 39.99999999999999,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      transferDates: input.transferDates as readonly string[],
      salePrices: input.salePrices as readonly number[],
      maximumHoldingDays: input.maximumHoldingDays as number,
      minimumGainPercent: input.minimumGainPercent as number,
    }),
  description:
    "Flag adjacent property transfers that meet caller-defined holding-period and price-gain thresholds.",
  id: "journalism/property-flip-pattern-screen",
  inputs: [
    { id: "transferDates", label: "Transfer dates", kind: "stringList" },
    {
      id: "salePrices",
      label: "Sale prices",
      kind: "numberList",
      unit: "currency",
    },
    {
      id: "maximumHoldingDays",
      label: "Maximum holding period",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "minimumGainPercent",
      label: "Minimum price gain",
      kind: "number",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "candidatePairs",
      label: "Candidate transfer pairs",
      kind: "stringList",
    },
    {
      id: "candidateCount",
      label: "Candidate count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "largestGainPercent",
      label: "Largest adjacent gain",
      kind: "number",
      unit: "%",
    },
  ],
  title: "Property Flip Pattern Screen",
});

export const run = tool.execute;
export default tool;
