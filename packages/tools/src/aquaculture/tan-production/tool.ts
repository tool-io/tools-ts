import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TanProductionInput = Readonly<{
  readonly dailyFeedKilograms: number;
  readonly tanGramsPerKgFeed: number;
}>;
export type TanProductionOutput = Readonly<{
  readonly tanProductionKgPerDay: number;
}>;

export const calculateTanProduction = (
  x: TanProductionInput,
): TanProductionOutput => {
  if (!Number.isFinite(x.dailyFeedKilograms) || x.dailyFeedKilograms < 0)
    simpleError("dailyFeedKilograms", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.tanGramsPerKgFeed) || x.tanGramsPerKgFeed < 0)
    simpleError("tanGramsPerKgFeed", "Provide a finite nonnegative number.");
  const tanProductionKgPerDay =
    (x.dailyFeedKilograms * x.tanGramsPerKgFeed) / 1000;
  if (!Number.isFinite(tanProductionKgPerDay))
    simpleError(
      "tanProductionKgPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    tanProductionKgPerDay: Object.is(tanProductionKgPerDay, -0)
      ? 0
      : tanProductionKgPerDay,
  };
};

export const example = {
  input: {
    dailyFeedKilograms: 100,
    tanGramsPerKgFeed: 30,
  },
  output: { tanProductionKgPerDay: 3 },
} satisfies ToolExample<TanProductionInput, TanProductionOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/tan-production",
  title: "TAN Production",
  description:
    "Estimate total-ammonia-nitrogen loading from daily feed and an explicitly supplied feed-to-TAN factor.",
  inputs: [
    {
      id: "dailyFeedKilograms",
      kind: "number",
      label: "Daily Feed Kilograms",
      unit: "kg/day",
    },
    {
      id: "tanGramsPerKgFeed",
      kind: "number",
      label: "TAN Grams Per Kg Feed",
      unit: "g TAN/kg feed",
    },
  ],
  outputs: [
    {
      id: "tanProductionKgPerDay",
      kind: "number",
      label: "TAN Production Kg Per Day",
      unit: "kg TAN/day",
    },
  ],
  calculate: (input) =>
    calculateTanProduction({
      dailyFeedKilograms: input.dailyFeedKilograms as number,
      tanGramsPerKgFeed: input.tanGramsPerKgFeed as number,
    }),
});
export const runTanProduction = tool.execute;
export default tool;
