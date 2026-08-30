import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly deliveredMessages: number;
  readonly reportedUniqueOpens: number;
  readonly estimatedMachineOpens: number;
}>;
export type Output = Readonly<{
  readonly adjustedHumanOpens: number;
  readonly reportedOpenRatePercent: number;
  readonly adjustedOpenRatePercent: number;
  readonly inflationPoints: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.deliveredMessages <= 0)
    simpleError(
      "deliveredMessages",
      "Delivered messages must be positive.",
      "invalid_delivery",
    );
  const adjustedHumanOpens = Math.max(
    0,
    input.reportedUniqueOpens - input.estimatedMachineOpens,
  );
  const reportedOpenRatePercent =
      (input.reportedUniqueOpens / input.deliveredMessages) * 100,
    adjustedOpenRatePercent =
      (adjustedHumanOpens / input.deliveredMessages) * 100;
  return {
    adjustedHumanOpens,
    reportedOpenRatePercent,
    adjustedOpenRatePercent,
    inflationPoints: reportedOpenRatePercent - adjustedOpenRatePercent,
  };
};

export const exampleInput = {
  deliveredMessages: 1000,
  reportedUniqueOpens: 500,
  estimatedMachineOpens: 100,
} satisfies Input;
export const exampleOutput = {
  adjustedHumanOpens: 400,
  reportedOpenRatePercent: 50,
  adjustedOpenRatePercent: 40,
  inflationPoints: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      deliveredMessages: input.deliveredMessages as number,
      reportedUniqueOpens: input.reportedUniqueOpens as number,
      estimatedMachineOpens: input.estimatedMachineOpens as number,
    }),
  description:
    "Adjust reported email opens for estimated machine-generated opens.",
  id: "journalism/open-rate-inflation",
  inputs: [
    {
      id: "deliveredMessages",
      label: "Delivered messages",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "reportedUniqueOpens",
      label: "Reported unique opens",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "estimatedMachineOpens",
      label: "Estimated machine opens",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "adjustedHumanOpens",
      label: "Adjusted human opens",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "reportedOpenRatePercent",
      label: "Reported open rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "adjustedOpenRatePercent",
      label: "Adjusted open rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "inflationPoints",
      label: "Estimated inflation",
      kind: "number",
      minimum: 0,
      unit: "percentage points",
    },
  ],
  title: "Open-Rate Inflation",
});

export const run = tool.execute;
export default tool;
