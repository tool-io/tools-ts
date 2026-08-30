import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MortalityRateInput = Readonly<{
  readonly deadAnimals: number;
  readonly initialAnimals: number;
}>;
export type MortalityRateOutput = Readonly<{
  readonly mortalityPercent: number;
}>;

export const calculateMortalityRate = (
  x: MortalityRateInput,
): MortalityRateOutput => {
  if (
    !Number.isFinite(x.deadAnimals) ||
    x.deadAnimals < 0 ||
    !Number.isSafeInteger(x.deadAnimals)
  )
    simpleError("deadAnimals", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.initialAnimals) ||
    x.initialAnimals <= 0 ||
    !Number.isSafeInteger(x.initialAnimals)
  )
    simpleError("initialAnimals", "Provide a positive whole number.");
  if (x.deadAnimals > x.initialAnimals)
    simpleError("deadAnimals", "Deaths cannot exceed initial stock.");
  const mortalityPercent = (x.deadAnimals / x.initialAnimals) * 100;
  if (!Number.isFinite(mortalityPercent))
    simpleError(
      "mortalityPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    mortalityPercent: Object.is(mortalityPercent, -0) ? 0 : mortalityPercent,
  };
};

export const example = {
  input: {
    deadAnimals: 100,
    initialAnimals: 1000,
  },
  output: { mortalityPercent: 10 },
} satisfies ToolExample<MortalityRateInput, MortalityRateOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/mortality-rate",
  title: "Mortality Rate",
  description:
    "Measure recorded deaths as a share of initial stock, excluding unobserved losses.",
  inputs: [
    {
      id: "deadAnimals",
      kind: "number",
      label: "Dead Animals",
      unit: "animals",
    },
    {
      id: "initialAnimals",
      kind: "number",
      label: "Initial Animals",
      unit: "animals",
    },
  ],
  outputs: [
    {
      id: "mortalityPercent",
      kind: "number",
      label: "Mortality Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateMortalityRate({
      deadAnimals: input.deadAnimals as number,
      initialAnimals: input.initialAnimals as number,
    }),
});
export const runMortalityRate = tool.execute;
export default tool;
