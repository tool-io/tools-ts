import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PeriodicIncrementPercentageInput = Readonly<{
  readonly startingValue: number;
  readonly endingValue: number;
}>;
export type PeriodicIncrementPercentageOutput = Readonly<{
  readonly incrementPercent: number;
}>;

export const calculatePeriodicIncrementPercentage = (
  x: PeriodicIncrementPercentageInput,
): PeriodicIncrementPercentageOutput => {
  if (!Number.isFinite(x.startingValue) || x.startingValue <= 0)
    simpleError("startingValue", "Provide a finite positive number.");
  if (!Number.isFinite(x.endingValue) || x.endingValue < 0)
    simpleError("endingValue", "Provide a finite nonnegative number.");
  const incrementPercent =
    (100 * (x.endingValue - x.startingValue)) / x.startingValue;
  if (!Number.isFinite(incrementPercent))
    simpleError(
      "incrementPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    incrementPercent: Object.is(incrementPercent, -0) ? 0 : incrementPercent,
  };
};

export const example = {
  input: {
    startingValue: 100,
    endingValue: 120,
  },
  output: { incrementPercent: 20 },
} satisfies ToolExample<
  PeriodicIncrementPercentageInput,
  PeriodicIncrementPercentageOutput
>;

export const tool = createSimpleTool({
  id: "forestry/periodic-increment-percentage",
  title: "Periodic Increment Percentage",
  description:
    "Percentage change in a stand metric over an inventory interval, without annualization.",
  inputs: [
    {
      id: "startingValue",
      kind: "number",
      label: "Starting Value",
      minimum: 0,
    },
    { id: "endingValue", kind: "number", label: "Ending Value", minimum: 0 },
  ],
  outputs: [
    {
      id: "incrementPercent",
      kind: "number",
      label: "Increment Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculatePeriodicIncrementPercentage({
      startingValue: input.startingValue as number,
      endingValue: input.endingValue as number,
    }),
});
export const periodicIncrementPercentageTool = tool;
export const runPeriodicIncrementPercentage = tool.execute;
export default tool;
