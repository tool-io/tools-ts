import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FertilizationRateInput = Readonly<{
  readonly fertilizedEggs: number;
  readonly eggsAssessed: number;
}>;
export type FertilizationRateOutput = Readonly<{
  readonly fertilizationPercent: number;
}>;

export const calculateFertilizationRate = (
  x: FertilizationRateInput,
): FertilizationRateOutput => {
  if (
    !Number.isFinite(x.fertilizedEggs) ||
    x.fertilizedEggs < 0 ||
    !Number.isSafeInteger(x.fertilizedEggs)
  )
    simpleError("fertilizedEggs", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.eggsAssessed) ||
    x.eggsAssessed <= 0 ||
    !Number.isSafeInteger(x.eggsAssessed)
  )
    simpleError("eggsAssessed", "Provide a positive whole number.");
  if (x.fertilizedEggs > x.eggsAssessed)
    simpleError(
      "fertilizedEggs",
      "Fertilized eggs cannot exceed assessed eggs.",
    );
  const fertilizationPercent = (x.fertilizedEggs / x.eggsAssessed) * 100;
  if (!Number.isFinite(fertilizationPercent))
    simpleError(
      "fertilizationPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    fertilizationPercent: Object.is(fertilizationPercent, -0)
      ? 0
      : fertilizationPercent,
  };
};

export const example = {
  input: {
    fertilizedEggs: 900,
    eggsAssessed: 1000,
  },
  output: { fertilizationPercent: 90 },
} satisfies ToolExample<FertilizationRateInput, FertilizationRateOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/fertilization-rate",
  title: "Fertilization Rate",
  description: "Measure the share of assessed eggs that show fertilization.",
  inputs: [
    {
      id: "fertilizedEggs",
      kind: "number",
      label: "Fertilized Eggs",
      unit: "eggs",
    },
    {
      id: "eggsAssessed",
      kind: "number",
      label: "Eggs Assessed",
      unit: "eggs",
    },
  ],
  outputs: [
    {
      id: "fertilizationPercent",
      kind: "number",
      label: "Fertilization Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateFertilizationRate({
      fertilizedEggs: input.fertilizedEggs as number,
      eggsAssessed: input.eggsAssessed as number,
    }),
});
export const runFertilizationRate = tool.execute;
export default tool;
