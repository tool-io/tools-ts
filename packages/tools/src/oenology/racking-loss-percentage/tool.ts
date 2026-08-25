import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type RackingLossPercentageInput = {
  readonly initialVolumeLiters: number;
  readonly remainingVolumeLiters: number;
};

export type RackingLossPercentageOutput = {
  readonly lossPercent: number;
};

export const rackingLossPercentageExample = {
  input: {
    initialVolumeLiters: 1000,
    remainingVolumeLiters: 975,
  },
  output: {
    lossPercent: 2.5,
  },
} satisfies ToolExample<
  RackingLossPercentageInput,
  RackingLossPercentageOutput
>;

export const calculateRackingLossPercentage = (
  input: RackingLossPercentageInput,
): RackingLossPercentageOutput => {
  if (input.initialVolumeLiters <= 0)
    simpleError(
      "initialVolumeLiters",
      "The initial volume must be positive.",
      "invalid_value",
    );
  if (input.remainingVolumeLiters > input.initialVolumeLiters)
    simpleError(
      "remainingVolumeLiters",
      "The remaining volume cannot exceed the initial volume.",
      "invalid_value",
    );
  if (input.remainingVolumeLiters < 0)
    simpleError(
      "remainingVolumeLiters",
      "The remaining volume cannot be negative.",
      "invalid_value",
    );
  return {
    lossPercent: roundStatistic(
      ((input.initialVolumeLiters - input.remainingVolumeLiters) /
        input.initialVolumeLiters) *
        100,
    ),
  };
};

export const rackingLossPercentageTool = createSimpleTool({
  calculate: (input) =>
    calculateRackingLossPercentage(
      input as unknown as RackingLossPercentageInput,
    ),
  description:
    "Express the volume left behind on lees as a percentage of the original lot during a racking.",
  id: "oenology/racking-loss-percentage",
  inputs: [
    {
      description: "Volume before the racking.",
      id: "initialVolumeLiters",
      kind: "number",
      label: "Initial volume",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Clean wine racked off the lees.",
      id: "remainingVolumeLiters",
      kind: "number",
      label: "Remaining volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Share of the lot left behind in the racking.",
      id: "lossPercent",
      kind: "number",
      label: "Racking loss",
      unit: "%",
    },
  ],
  title: "Racking Loss Percentage Calculator",
});
export const runRackingLossPercentage = rackingLossPercentageTool.execute;
export default rackingLossPercentageTool;
