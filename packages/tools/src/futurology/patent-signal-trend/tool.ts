import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly earlierPatentCount: number;
  readonly recentPatentCount: number;
  readonly periodYears: number;
  readonly signalGrowthThresholdPercent: number;
}>;
export type Output = Readonly<{
  readonly annualizedGrowthPercent: number;
  readonly absoluteGrowth: number;
  readonly emergingSignal: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.earlierPatentCount <= 0 || input.periodYears <= 0)
    simpleError(
      "earlierPatentCount",
      "Earlier count and period must be positive.",
      "invalid_baseline",
    );
  const annualizedGrowthPercent =
    ((input.recentPatentCount / input.earlierPatentCount) **
      (1 / input.periodYears) -
      1) *
    100;
  return {
    annualizedGrowthPercent,
    absoluteGrowth: input.recentPatentCount - input.earlierPatentCount,
    emergingSignal:
      annualizedGrowthPercent >= input.signalGrowthThresholdPercent,
  };
};

export const exampleInput = {
  earlierPatentCount: 100,
  recentPatentCount: 121,
  periodYears: 2,
  signalGrowthThresholdPercent: 10,
} satisfies Input;
export const exampleOutput = {
  annualizedGrowthPercent: 10.000000000000009,
  absoluteGrowth: 21,
  emergingSignal: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      earlierPatentCount: input.earlierPatentCount as number,
      recentPatentCount: input.recentPatentCount as number,
      periodYears: input.periodYears as number,
      signalGrowthThresholdPercent:
        input.signalGrowthThresholdPercent as number,
    }),
  description:
    "Measure annualized patent-count growth against an emerging-signal threshold.",
  id: "futurology/patent-signal-trend",
  inputs: [
    {
      id: "earlierPatentCount",
      label: "Earlier-period patent count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "recentPatentCount",
      label: "Recent-period patent count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "periodYears",
      label: "Years between periods",
      kind: "number",
      minimum: 0,
      unit: "years",
    },
    {
      id: "signalGrowthThresholdPercent",
      label: "Signal growth threshold",
      kind: "number",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "annualizedGrowthPercent",
      label: "Annualized patent growth",
      kind: "number",
      unit: "%",
    },
    {
      id: "absoluteGrowth",
      label: "Absolute patent-count growth",
      kind: "integer",
    },
    {
      id: "emergingSignal",
      label: "Growth meets supplied signal threshold",
      kind: "boolean",
    },
  ],
  title: "Patent Signal Trend",
});

export const run = tool.execute;
export default tool;
