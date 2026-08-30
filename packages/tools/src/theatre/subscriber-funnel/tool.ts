import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly prospects: number;
  readonly trialSubscribers: number;
  readonly paidSubscribers: number;
}>;
export type Output = Readonly<{
  readonly prospectToTrialPercent: number;
  readonly trialToPaidPercent: number;
  readonly overallConversionPercent: number;
  readonly prospectDropoff: number;
  readonly trialDropoff: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.trialSubscribers > input.prospects ||
    input.paidSubscribers > input.trialSubscribers
  )
    simpleError(
      "trialSubscribers",
      "Funnel counts must be nonincreasing.",
      "invalid_funnel",
    );
  return {
    prospectToTrialPercent:
      input.prospects === 0
        ? 0
        : (input.trialSubscribers / input.prospects) * 100,
    trialToPaidPercent:
      input.trialSubscribers === 0
        ? 0
        : (input.paidSubscribers / input.trialSubscribers) * 100,
    overallConversionPercent:
      input.prospects === 0
        ? 0
        : (input.paidSubscribers / input.prospects) * 100,
    prospectDropoff: input.prospects - input.trialSubscribers,
    trialDropoff: input.trialSubscribers - input.paidSubscribers,
  };
};

export const exampleInput = {
  prospects: 1000,
  trialSubscribers: 200,
  paidSubscribers: 80,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  prospects: 0,
  trialSubscribers: 0,
  paidSubscribers: 0,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      prospects: input.prospects as number,
      trialSubscribers: input.trialSubscribers as number,
      paidSubscribers: input.paidSubscribers as number,
    }),
  description:
    "Calculate conversion rates and drop-off through a three-stage subscriber funnel.",
  id: "theatre/subscriber-funnel",
  inputs: [
    { id: "prospects", label: "Prospects", kind: "integer", minimum: 0 },
    {
      id: "trialSubscribers",
      label: "Trial subscribers",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "paidSubscribers",
      label: "Paid subscribers",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "prospectToTrialPercent",
      label: "Prospect-to-trial conversion",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "trialToPaidPercent",
      label: "Trial-to-paid conversion",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "overallConversionPercent",
      label: "Overall conversion",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "prospectDropoff",
      label: "Prospect drop-off",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "trialDropoff",
      label: "Trial drop-off",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Subscriber Funnel",
});

export const run = tool.execute;
export default tool;
